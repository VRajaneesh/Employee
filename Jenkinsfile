pipeline {
    agent any
    environment {
        DOCKERHUB_USER = credentials('dockerhub-user')
        DOCKERHUB_PASS = credentials('dockerhub-pass')
        ENV_FILE = 'employee_app/.env.prod' // Use prod env for main branch
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Backend') {
            steps {
                sh 'docker build -t employee-backend:latest ./employee_app'
            }
        }
        stage('Build Frontend') {
            steps {
                sh 'docker build -t employee-frontend:latest ./angular'
            }
        }
        stage('Test Backend') {
            steps {
                sh 'pip install -r employee_app/requirements.txt'
                sh 'pytest employee_app/tests'
            }
        }
        stage('Test Frontend') {
            steps {
                sh 'cd angular && npm install && ng test --watch=false'
            }
        }
        stage('Push Images') {
            when {
                branch 'main'
            }
            steps {
                sh 'echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin'
                sh 'docker tag employee-backend:latest $DOCKERHUB_USER/employee-backend:latest'
                sh 'docker tag employee-frontend:latest $DOCKERHUB_USER/employee-frontend:latest'
                sh 'docker push $DOCKERHUB_USER/employee-backend:latest'
                sh 'docker push $DOCKERHUB_USER/employee-frontend:latest'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker-compose --env-file $ENV_FILE -f docker-compose.yml up -d'
            }
        }
    }
    post {
        always {
            echo 'Post actions completed'
            // archiveArtifacts artifacts: '**/report.html', allowEmptyArchive: true
        }
        failure {
            echo 'Build failed'
            // mail to: 'your-team@email.com', subject: 'Jenkins Build Failed', body: 'Check Jenkins for details.'
        }
    }
}
