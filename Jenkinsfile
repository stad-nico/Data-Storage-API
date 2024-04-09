pipeline {
    agent {
        label "linux"
    }

    tools {
        nodejs "latest"
    }

    stages {
        stage("Backend Install") {
            steps {
                dir("backend") {
                    sh "npm ci"
                }
            }
        }

        stage("Backend Unit Tests") {
            steps {
                dir("backend") {
                    sh "npm run test:unit"
                }
            }
        }

        stage("Backend Integration Tests") {
            steps {
                dir("backend") {
                    sh "npm run test:integration"
                }
            }
        }

        stage("Backend e2e Tests") {
            steps {
                dir("backend") {
                    sh "npm run test:e2e"
                }
            }
        }
    }
}