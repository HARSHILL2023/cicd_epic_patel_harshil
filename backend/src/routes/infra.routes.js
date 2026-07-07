// src/routes/infra.routes.js
import express from 'express';
import { getAllItems } from '../controllers/knowledge.controller.js';

const router = express.Router();

/**
 * Topic injection middleware — injects the topic query param
 * so the existing getAllItems controller filters by topic.
 * Zero new controller logic needed for 20 routes.
 */
const injectTopic = (topic) => (req, res, next) => {
  req.query.topic = topic;
  next();
};

// GET /api/v1/infra/k8s
router.get('/k8s', injectTopic('k8s'), getAllItems);

// GET /api/v1/infra/docker
router.get('/docker', injectTopic('docker'), getAllItems);

// GET /api/v1/infra/helm
router.get('/helm', injectTopic('helm'), getAllItems);

// GET /api/v1/infra/terraform
router.get('/terraform', injectTopic('terraform'), getAllItems);

// GET /api/v1/infra/aws
router.get('/aws', injectTopic('aws'), getAllItems);

// GET /api/v1/infra/gcp
router.get('/gcp', injectTopic('gcp'), getAllItems);

// GET /api/v1/infra/azure
router.get('/azure', injectTopic('azure'), getAllItems);

// GET /api/v1/infra/pods
router.get('/pods', injectTopic('pods'), getAllItems);

// GET /api/v1/infra/services
router.get('/services', injectTopic('services'), getAllItems);

// GET /api/v1/infra/deployments
router.get('/deployments', injectTopic('deployments'), getAllItems);

// GET /api/v1/infra/ingress
router.get('/ingress', injectTopic('ingress'), getAllItems);

// GET /api/v1/infra/configmaps
router.get('/configmaps', injectTopic('configmaps'), getAllItems);

// GET /api/v1/infra/secrets
router.get('/secrets', injectTopic('secrets'), getAllItems);

// GET /api/v1/infra/volumes
router.get('/volumes', injectTopic('volumes'), getAllItems);

// GET /api/v1/infra/networking
router.get('/networking', injectTopic('networking'), getAllItems);

// GET /api/v1/infra/autoscaling
router.get('/autoscaling', injectTopic('autoscaling'), getAllItems);

// GET /api/v1/infra/security
router.get('/security', injectTopic('security'), getAllItems);

// GET /api/v1/infra/monitoring
router.get('/monitoring', injectTopic('monitoring'), getAllItems);

// GET /api/v1/infra/logging
router.get('/logging', injectTopic('logging'), getAllItems);

// GET /api/v1/infra/templates
router.get('/templates', injectTopic('templates'), getAllItems);

export default router;
