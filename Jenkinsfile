pipeline {
    agent any

    options {
        timestamps()
        skipDefaultCheckout(true)
    }

    environment {
        FRONTEND_IMAGE = "ai-ecommerce-frontend"
        BACKEND_IMAGE  = "ai-ecommerce-backend"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Source code checked out successfully.'
            }
        }

        stage('Validate Docker Compose') {
            steps {
                sh '''
                    set -eu
                    docker compose -f application/docker-compose.yml config -q
                    echo "Docker Compose configuration is valid."
                '''
            }
        }

        stage('Backend Health Test') {
            steps {
                sh '''
                    set -eu
                    curl --fail --silent --show-error \
                      http://localhost:5000/health
                    echo
                    echo "Backend health test passed."
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    set -eu
                    docker build \
                      -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} \
                      -t ${FRONTEND_IMAGE}:latest \
                      application/frontend
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                    set -eu
                    docker build \
                      -t ${BACKEND_IMAGE}:${BUILD_NUMBER} \
                      -t ${BACKEND_IMAGE}:latest \
                      application/backend
                '''
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: E-commerce CI pipeline completed.'
        }
        failure {
            echo 'FAILED: Check the stage logs to identify the problem.'
        }
        always {
            echo 'Pipeline execution finished.'
        }
    }
}
