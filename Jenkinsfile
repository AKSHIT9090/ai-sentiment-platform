pipeline {

    environment {
        GIT_HTTP_VERSION = "HTTP/1.1"
        PATH = "C:\\Users\\AKKI\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;$env.PATH"
        DOCKER_CONFIG = "C:\\Users\\AKKI\\.docker"
    }

    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Backend Tests') {
            steps {
                echo 'Running backend tests...'
                dir('backend') {
                    bat 'npm ci'
                    bat 'npm test -- --runInBand'
                }
            }
        }

        stage('ML Service Tests') {
            steps {
                echo 'Installing ML test dependencies...'
                dir('ml-service') {
                    bat 'python -m pip install -r requirements.txt'
                    bat 'python -m pip install pytest httpx'
                    bat 'python -m pytest -v'
                }
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Running code quality checks...'
                dir('frontend') {
                    bat 'npm ci'
                    bat 'npm run lint -- --max-warnings 0'
                }
            }
        }

        stage('Docker Compose Validation') {
            steps {
                echo 'Validating Docker Compose configuration...'
                bat 'docker compose config'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker images...'
                bat 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Starting application stack...'
                bat 'docker compose up -d'
            }
        }

        stage('Health Checks') {
            steps {
                echo 'Checking application health...'

                bat '''
                    powershell -Command "$backend = Invoke-RestMethod http://localhost:5000/api/health; if ($backend.status -ne 'healthy') { exit 1 }"
                '''

                bat '''
                    powershell -Command "$ml = Invoke-RestMethod http://localhost:8000/health; if ($ml.status -ne 'healthy') { exit 1 }"
                '''

                echo 'Backend and ML health checks passed.'
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'CI/CD pipeline failed. Check the stage logs.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}