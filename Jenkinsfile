pipeline {
    agent any

    options {
        timestamps()
        skipDefaultCheckout(true)
    }

    stages {
        stage('Checkout Source') {
            steps {
                checkout scm
                echo 'Source code checked out successfully.'
            }
        }

        stage('Trigger WSL CI Build') {
            steps {
                bat 'if exist C:\\JenkinsWslBridge\\build-output.txt del /q C:\\JenkinsWslBridge\\build-output.txt'

                bat 'schtasks /run /tn "\\JenkinsWslBridgeTest"'

                powershell '''
                    $log = "C:\\JenkinsWslBridge\\build-output.txt"
                    $finished = $false

                    for ($i = 0; $i -lt 60; $i++) {
                        Start-Sleep -Seconds 5

                        if ((Test-Path $log) -and
                            (Select-String -Path $log -Pattern "^EXIT_CODE=" -Quiet)) {
                            $finished = $true
                            break
                        }
                    }

                    if (-not $finished) {
                        throw "Timed out waiting for the WSL CI build."
                    }

                    Get-Content $log

                    if (-not (Select-String -Path $log -Pattern "^JENKINS_WSL_CI_SUCCESS$" -Quiet)) {
                        throw "The WSL CI success marker was not found."
                    }

                    if (-not (Select-String -Path $log -Pattern "^EXIT_CODE=0$" -Quiet)) {
                        throw "The WSL CI build failed."
                    }

                    Write-Host "Jenkins WSL CI build passed."
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
            archiveArtifacts artifacts: 'security/reports/**', allowEmptyArchive: true
            echo 'Pipeline execution finished.'
        }
    }
}
