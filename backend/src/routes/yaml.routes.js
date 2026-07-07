// src/routes/yaml.routes.js
import express from 'express';
import {
  validateYaml,
  lintYaml,
  formatYaml,
  getTemplates,
  getK8sTemplate,
  getDockerTemplate,
  getGithubActionsTemplate,
  getGitlabCiTemplate,
  getJenkinsTemplate,
  compareYaml,
  mergeYaml,
  getYamlExamples,
  yamlToJson,
  jsonToYaml,
  getBestPractices
} from '../controllers/yaml.controller.js';

const router = express.Router();

// ─── Template sub-routes MUST come BEFORE /templates to avoid prefix conflict ─
router.get('/templates/k8s', getK8sTemplate);
router.get('/templates/docker', getDockerTemplate);
router.get('/templates/github-actions', getGithubActionsTemplate);
router.get('/templates/gitlab-ci', getGitlabCiTemplate);
router.get('/templates/jenkins', getJenkinsTemplate);
router.get('/templates', getTemplates);

// ─── POST routes ──────────────────────────────────────────────────────────────
router.post('/validate', validateYaml);
router.post('/lint', lintYaml);
router.post('/format', formatYaml);
router.post('/compare', compareYaml);
router.post('/merge', mergeYaml);
router.post('/convert/json', yamlToJson);
router.post('/convert/yaml', jsonToYaml);

// ─── GET routes ───────────────────────────────────────────────────────────────
router.get('/examples', getYamlExamples);
router.get('/best-practices', getBestPractices);

export default router;
