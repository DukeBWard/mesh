import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

const config = new pulumi.Config();
const environment = pulumi.getStack(); // dev, staging, prod
const appName = 'mesh';

// frontend config
const frontendImage = config.get('frontendImage') || 'mesh-frontend:latest';
const frontendReplicas = config.getNumber('frontendReplicas') || 2;
const frontendPort = config.getNumber('frontendPort') || 3000;

// backend config
const backendImage = config.get('backendImage') || 'mesh-backend:latest';
const backendReplicas = config.getNumber('backendReplicas') || 2;
const backendPort = config.getNumber('backendPort') || 8080;

// Create a Kubernetes namespace 
const namespace = new k8s.core.v1.Namespace(`${appName}-${environment}`, {
    metadata: {
        name: `${appName}-${environment}`,
        labels: {
            'app': appName,
            'environment': environment,
        },
    },
});

// Labels to be used across all resources
const commonLabels = {
    'app': appName,
    'environment': environment,
};

// Frontend deployment
const frontendDeployment = new k8s.apps.v1.Deployment(`${appName}-frontend`, {
    metadata: {
        namespace: namespace.metadata.name,
        labels: { ...commonLabels, component: 'frontend' },
    },
    spec: {
        replicas: frontendReplicas,
        selector: {
            matchLabels: { ...commonLabels, component: 'frontend' },
        },
        template: {
            metadata: {
                labels: { ...commonLabels, component: 'frontend' },
            },
            spec: {
                containers: [{
                    name: 'frontend',
                    image: frontendImage,
                    ports: [{ containerPort: frontendPort }],
                    resources: {
                        requests: {
                            cpu: '100m',
                            memory: '128Mi',
                        },
                        limits: {
                            cpu: '500m',
                            memory: '512Mi',
                        },
                    },
                    env: [
                        { name: 'NODE_ENV', value: environment },
                        { name: 'BACKEND_URL', value: `http://${appName}-backend:${backendPort}` },
                    ],
                    readinessProbe: {
                        httpGet: {
                            path: '/',
                            port: frontendPort,
                        },
                        initialDelaySeconds: 10,
                        periodSeconds: 5,
                    },
                }],
            },
        },
    },
});

// Frontend service
const frontendService = new k8s.core.v1.Service(`${appName}-frontend`, {
    metadata: {
        namespace: namespace.metadata.name,
        labels: { ...commonLabels, component: 'frontend' },
    },
    spec: {
        type: 'ClusterIP',
        ports: [{ port: frontendPort, targetPort: frontendPort }],
        selector: { ...commonLabels, component: 'frontend' },
    },
});

// Backend deployment
const backendDeployment = new k8s.apps.v1.Deployment(`${appName}-backend`, {
    metadata: {
        namespace: namespace.metadata.name,
        labels: { ...commonLabels, component: 'backend' },
    },
    spec: {
        replicas: backendReplicas,
        selector: {
            matchLabels: { ...commonLabels, component: 'backend' },
        },
        template: {
            metadata: {
                labels: { ...commonLabels, component: 'backend' },
            },
            spec: {
                containers: [{
                    name: 'backend',
                    image: backendImage,
                    ports: [{ containerPort: backendPort }],
                    resources: {
                        requests: {
                            cpu: '200m',
                            memory: '256Mi',
                        },
                        limits: {
                            cpu: '1',
                            memory: '1Gi',
                        },
                    },
                    env: [
                        { name: 'ENV', value: environment },
                    ],
                    readinessProbe: {
                        httpGet: {
                            path: '/health',
                            port: backendPort,
                        },
                        initialDelaySeconds: 15,
                        periodSeconds: 10,
                    },
                }],
            },
        },
    },
});

// Backend service
const backendService = new k8s.core.v1.Service(`${appName}-backend`, {
    metadata: {
        namespace: namespace.metadata.name,
        labels: { ...commonLabels, component: 'backend' },
    },
    spec: {
        type: 'ClusterIP',
        ports: [{ port: backendPort, targetPort: backendPort }],
        selector: { ...commonLabels, component: 'backend' },
    },
});

// Create an Ingress resource for external access
const ingress = new k8s.networking.v1.Ingress(`${appName}-ingress`, {
    metadata: {
        namespace: namespace.metadata.name,
        labels: commonLabels,
        annotations: {
            'kubernetes.io/ingress.class': 'nginx',
            'nginx.ingress.kubernetes.io/rewrite-target': '/',
        },
    },
    spec: {
        rules: [{
            http: {
                paths: [
                    {
                        path: '/',
                        pathType: 'Prefix',
                        backend: {
                            service: {
                                name: frontendService.metadata.name,
                                port: { number: frontendPort },
                            },
                        },
                    },
                    {
                        path: '/api',
                        pathType: 'Prefix',
                        backend: {
                            service: {
                                name: backendService.metadata.name,
                                port: { number: backendPort },
                            },
                        },
                    },
                ],
            },
        }],
    },
});

// Export the namespace name
export const namespaceName = namespace.metadata.name;

// Export the frontend service name and port
export const frontendServiceName = frontendService.metadata.name;
export const frontendServicePort = frontendPort;

// Export the backend service name and port
export const backendServiceName = backendService.metadata.name;
export const backendServicePort = backendPort;

// Export the ingress hostname
export const ingressHost = ingress.status.loadBalancer.ingress[0].hostname;
