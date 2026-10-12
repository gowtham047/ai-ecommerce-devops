pipeline {
    agent any

    options {
        timestamps()
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
                bat 'docker compose config --quiet'
            }
        }

        stage('Backend Health Test') {
            steps {
                bat '''
                    powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $r=Invoke-RestMethod -Uri 'http://localhost:5000/health' -TimeoutSec 10; $r | ConvertTo-Json -Compress; if ($r.status -ne 'UP') { exit 1 }"
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat 'docker build -t application-frontend:latest -f application/frontend/Dockerfile application/frontend'
            }
        }

        stage('Build Backend Image') {
            steps {
                bat 'docker build -t application-backend:latest -f application/backend/Dockerfile application/backend'
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: All pipeline stages completed.'
        }
        failure {
            echo 'FAILED: Check the first failed stage in Console Output.'
        }
        always {
            echo 'Pipeline execution finished.'
        }
    }
}
      
