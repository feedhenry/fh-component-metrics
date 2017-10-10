#!groovy

// https://github.com/feedhenry/fh-pipeline-library
@Library('fh-pipeline-library') _

node('nodejs4') {
    stage('Checkout') {
        step([$class: 'WsCleanup'])
        checkout scm
    }

    stage('Install Dependencies') {
        npmInstall {}
    }

    stage('Lint') {
        sh 'grunt eslint'
    }

    stage('Unit tests') {
        sh 'grunt fh-unit'
    }

    stage('Build') {
        gruntBuild {
            name = 'fh-component-metrics'
        }
    }
}
