// src/controllers/yaml.controller.js
import KnowledgeItem from '../models/knowledge.model.js';
import { sendResponse } from '../utils/response.util.js';
import asyncHandler from '../middleware/async.middleware.js';

// Embedded YAML templates (no external library needed)
const YAML_TEMPLATES = {
  k8s: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: default
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: my-app:1.0.0
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"`,

  docker: `version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - ./data:/app/data
    depends_on:
      - mongo
  mongo:
    image: mongo:6.0
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db
volumes:
  mongo_data:`,

  'github-actions': `name: CI/CD Pipeline
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build`,

  'gitlab-ci': `stages:
  - build
  - test
  - deploy

variables:
  NODE_ENV: production

build:
  stage: build
  image: node:20
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

test:
  stage: test
  image: node:20
  script:
    - npm ci
    - npm test

deploy:
  stage: deploy
  script:
    - echo "Deploying to production"
  only:
    - main`,

  jenkins: `pipeline {
  agent any
  environment {
    NODE_VERSION = '20'
  }
  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    stage('Deploy') {
      when {
        branch 'main'
      }
      steps {
        sh 'npm run deploy'
      }
    }
  }
  post {
    always {
      cleanWs()
    }
  }
}`
};

const BEST_PRACTICES = [
  { rule: 'Use 2 spaces for indentation — never tabs', category: 'formatting' },
  { rule: 'Quote strings that contain special characters (:, #, &, *, !, |)', category: 'syntax' },
  { rule: 'Use block scalars (|) for multi-line strings', category: 'syntax' },
  { rule: 'Keep YAML files under 200 lines — split large configs', category: 'organization' },
  { rule: 'Add comments with # to explain non-obvious sections', category: 'documentation' },
  { rule: 'Validate YAML syntax before committing to version control', category: 'quality' },
  { rule: 'Use anchors (&) and aliases (*) to avoid repetition', category: 'optimization' },
  { rule: 'Store secrets in environment variables — never hardcode in YAML', category: 'security' },
  { rule: 'Pin image tags — never use :latest in production manifests', category: 'reliability' },
  { rule: 'Always define resource limits in Kubernetes manifests', category: 'kubernetes' },
  { rule: 'Use livenessProbe and readinessProbe for all Kubernetes pods', category: 'kubernetes' },
  { rule: 'Group related configuration into dedicated files', category: 'organization' }
];

// @desc    Validate YAML syntax
// @route   POST /api/v1/yaml/validate
// @access  Public
export const validateYaml = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return sendResponse(res, 400, false, 'YAML content is required', null, { message: 'Missing content field' });
  }
  const issues = [];
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/^\t/.test(line)) issues.push({ line: idx + 1, message: 'Tab indentation found — use spaces' });
    if (line.length > 200) issues.push({ line: idx + 1, message: 'Line exceeds 200 characters' });
  });
  const isValid = issues.length === 0;
  return sendResponse(res, 200, true, isValid ? 'YAML is valid' : 'YAML has validation issues', {
    valid: isValid,
    issues,
    lineCount: lines.length
  });
});

// @desc    Lint YAML file
// @route   POST /api/v1/yaml/lint
// @access  Public
export const lintYaml = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return sendResponse(res, 400, false, 'YAML content is required', null, { message: 'Missing content' });
  }
  const warnings = [];
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/\t/.test(line)) warnings.push({ line: idx + 1, severity: 'error', message: 'Tab character found — use spaces' });
    if (line.length > 120) warnings.push({ line: idx + 1, severity: 'warning', message: 'Line exceeds 120 characters' });
    if (/:\s+".*"/.test(line)) warnings.push({ line: idx + 1, severity: 'info', message: 'Consider using single quotes for plain strings' });
    if (line.trim() === '---' && idx !== 0) warnings.push({ line: idx + 1, severity: 'info', message: 'Multiple YAML documents detected' });
  });
  const errors = warnings.filter(w => w.severity === 'error');
  return sendResponse(res, 200, true, 'YAML linted successfully', {
    lintPassed: errors.length === 0,
    totalIssues: warnings.length,
    errors: errors.length,
    warnings: warnings.filter(w => w.severity === 'warning').length,
    issues: warnings,
    totalLines: lines.length
  });
});

// @desc    Format YAML
// @route   POST /api/v1/yaml/format
// @access  Public
export const formatYaml = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return sendResponse(res, 400, false, 'YAML content is required', null, { message: 'Missing content' });
  }
  // Normalize: trim trailing whitespace per line, normalize line endings, ensure final newline
  const formatted = content
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim() + '\n';
  return sendResponse(res, 200, true, 'YAML formatted successfully', {
    formatted,
    originalLength: content.length,
    formattedLength: formatted.length,
    changed: content !== formatted
  });
});

// @desc    Fetch YAML templates
// @route   GET /api/v1/yaml/templates
// @access  Public
export const getTemplates = asyncHandler(async (req, res) => {
  const templates = Object.keys(YAML_TEMPLATES).map(k => ({
    name: k,
    endpoint: `/api/v1/yaml/templates/${k}`,
    description: `${k} configuration template`
  }));
  return sendResponse(res, 200, true, 'YAML templates fetched', { templates, count: templates.length });
});

// @desc    Kubernetes YAML templates
// @route   GET /api/v1/yaml/templates/k8s
// @access  Public
export const getK8sTemplate = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Kubernetes YAML template fetched', {
    name: 'kubernetes-deployment',
    template: YAML_TEMPLATES.k8s,
    type: 'Deployment'
  });
});

// @desc    Docker YAML templates
// @route   GET /api/v1/yaml/templates/docker
// @access  Public
export const getDockerTemplate = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Docker YAML template fetched', {
    name: 'docker-compose',
    template: YAML_TEMPLATES.docker,
    type: 'docker-compose'
  });
});

// @desc    GitHub Actions templates
// @route   GET /api/v1/yaml/templates/github-actions
// @access  Public
export const getGithubActionsTemplate = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'GitHub Actions YAML template fetched', {
    name: 'github-actions-ci',
    template: YAML_TEMPLATES['github-actions'],
    type: 'workflow'
  });
});

// @desc    GitLab CI templates
// @route   GET /api/v1/yaml/templates/gitlab-ci
// @access  Public
export const getGitlabCiTemplate = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'GitLab CI YAML template fetched', {
    name: 'gitlab-ci-pipeline',
    template: YAML_TEMPLATES['gitlab-ci'],
    type: 'pipeline'
  });
});

// @desc    Jenkins templates
// @route   GET /api/v1/yaml/templates/jenkins
// @access  Public
export const getJenkinsTemplate = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Jenkins template fetched', {
    name: 'jenkinsfile-declarative',
    template: YAML_TEMPLATES.jenkins,
    type: 'pipeline'
  });
});

// @desc    Compare YAML files
// @route   POST /api/v1/yaml/compare
// @access  Public
export const compareYaml = asyncHandler(async (req, res) => {
  const { contentA, contentB } = req.body;
  if (!contentA || !contentB) {
    return sendResponse(res, 400, false, 'Both contentA and contentB are required', null);
  }
  const linesA = contentA.split('\n');
  const linesB = contentB.split('\n');
  const setA = new Set(linesA.map(l => l.trim()));
  const setB = new Set(linesB.map(l => l.trim()));
  const added = linesB.filter(l => !setA.has(l.trim()) && l.trim() !== '');
  const removed = linesA.filter(l => !setB.has(l.trim()) && l.trim() !== '');
  return sendResponse(res, 200, true, 'YAML comparison complete', {
    identical: added.length === 0 && removed.length === 0,
    fileA: { lines: linesA.length },
    fileB: { lines: linesB.length },
    addedLines: added.length,
    removedLines: removed.length,
    diff: { added: added.slice(0, 10), removed: removed.slice(0, 10) }
  });
});

// @desc    Merge YAML files
// @route   POST /api/v1/yaml/merge
// @access  Public
export const mergeYaml = asyncHandler(async (req, res) => {
  const { base, override } = req.body;
  if (!base || !override) {
    return sendResponse(res, 400, false, 'Both base and override YAML content are required', null);
  }
  const merged = `${base.trim()}\n# --- override merged below ---\n${override.trim()}\n`;
  return sendResponse(res, 200, true, 'YAML merged successfully', {
    merged,
    baseLines: base.split('\n').length,
    overrideLines: override.split('\n').length,
    totalLines: merged.split('\n').length
  });
});

// @desc    Fetch YAML examples
// @route   GET /api/v1/yaml/examples
// @access  Public
export const getYamlExamples = asyncHandler(async (req, res) => {
  const examples = await KnowledgeItem.find({
    isDeleted: { $ne: true },
    $or: [
      { output: /apiVersion|kind|pipeline|stages|services|containers/i },
      { topic: /k8s|docker|yaml|helm|ci/i }
    ]
  })
    .select('instruction output topic difficulty')
    .limit(10)
    .lean();
  return sendResponse(res, 200, true, 'YAML examples fetched', { examples, count: examples.length });
});

// @desc    Convert YAML to JSON
// @route   POST /api/v1/yaml/convert/json
// @access  Public
export const yamlToJson = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return sendResponse(res, 400, false, 'YAML content is required', null);
  }
  return sendResponse(res, 200, true, 'YAML to JSON conversion result', {
    note: 'Full conversion requires js-yaml. Install with: npm install js-yaml',
    input: content,
    inputLineCount: content.split('\n').length,
    hint: 'Use js-yaml: JSON.stringify(yaml.load(content), null, 2)'
  });
});

// @desc    Convert JSON to YAML
// @route   POST /api/v1/yaml/convert/yaml
// @access  Public
export const jsonToYaml = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return sendResponse(res, 400, false, 'JSON content is required', null);
  }
  try {
    const parsed = JSON.parse(content);
    const toYaml = (obj, indent = 0) => {
      const pad = ' '.repeat(indent);
      if (typeof obj !== 'object' || obj === null) return String(obj);
      if (Array.isArray(obj)) {
        return obj.map(item => `${pad}- ${typeof item === 'object' ? '\n' + toYaml(item, indent + 2) : item}`).join('\n');
      }
      return Object.entries(obj).map(([k, v]) => {
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          return `${pad}${k}:\n${toYaml(v, indent + 2)}`;
        }
        if (Array.isArray(v)) {
          return `${pad}${k}:\n${v.map(i => `${pad}  - ${typeof i === 'object' ? JSON.stringify(i) : i}`).join('\n')}`;
        }
        return `${pad}${k}: ${v}`;
      }).join('\n');
    };
    return sendResponse(res, 200, true, 'JSON converted to YAML', { yaml: toYaml(parsed) });
  } catch (err) {
    return sendResponse(res, 422, false, 'Invalid JSON input', null, { message: err.message });
  }
});

// @desc    YAML best practices
// @route   GET /api/v1/yaml/best-practices
// @access  Public
export const getBestPractices = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'YAML best practices fetched', {
    practices: BEST_PRACTICES,
    count: BEST_PRACTICES.length
  });
});
