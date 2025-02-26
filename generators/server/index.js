/**
 * Copyright 2013-2019 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable consistent-return */
const chalk = require('chalk');
const _ = require('lodash');
const os = require('os');
const shelljs = require('shelljs');
const packagejs = require('../../package.json');
const prompts = require('./prompts')
const writeFiles = require('./files').writeFiles;
const ServerGenerator = require('generator-jhipster/generators/server');
const constants = require('../generator-dotnetcore-constants');
const dotnet = require('../dotnet');
const toPascalCase = require('to-pascal-case');

module.exports = class extends ServerGenerator {
    constructor(args, opts) {
        super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint dotnetcore')}`);
        }
        if (!shelljs.which('dotnet')) {
            this.error(`Sorry, you need dotnet to be installed`);
        }
        this.configOptions = jhContext.configOptions || {};
        // This sets up options for this sub generator and is being reused from JHipster
        jhContext.setupServerOptions(this, jhContext);
    }

    get initializing() {
        const phaseFromJHipster = super._initializing();
        const jhipsterNetPhaseSetps = {
            displayLogo() {
                this.printJHipsterNetLogo();
            },
            setupServerconsts() {
                this.packagejs = packagejs;
                this.jhipsterNetVersion = packagejs.version;
                const configuration = this.getAllJhipsterConfig(this, true);
                this.SERVER_SRC_DIR = constants.SERVER_SRC_DIR;
                this.SERVER_TEST_DIR = constants.SERVER_TEST_DIR;
                this.namespace = configuration.get('namespace') || this.configOptions.namespace;

            }
        }
        return Object.assign(phaseFromJHipster, jhipsterNetPhaseSetps);
    }

    printJHipsterNetLogo() {
        this.log('\n');
        this.log(`${chalk.green('        ██╗')}${chalk.red(' ██╗   ██╗ ████████╗ ███████╗   ██████╗ ████████╗ ████████╗ ███████╗')}${chalk.magenta('    ███╗   ██╗███████╗████████╗')}`);
        this.log(`${chalk.green('        ██║')}${chalk.red(' ██║   ██║ ╚══██╔══╝ ██╔═══██╗ ██╔════╝ ╚══██╔══╝ ██╔═════╝ ██╔═══██╗')}${chalk.magenta('   ████╗  ██║██╔════╝╚══██╔══╝')}`);
        this.log(`${chalk.green('        ██║')}${chalk.red(' ████████║    ██║    ███████╔╝ ╚█████╗     ██║    ██████╗   ███████╔╝')}${chalk.magenta('   ██╔██╗ ██║█████╗     ██║')}`);
        this.log(`${chalk.green('  ██╗   ██║')}${chalk.red(' ██╔═══██║    ██║    ██╔════╝   ╚═══██╗    ██║    ██╔═══╝   ██╔══██║')}${chalk.magenta('    ██║╚██╗██║██╔══╝     ██║')}`);
        this.log(`${chalk.green('  ╚██████╔╝')}${chalk.red(' ██║   ██║ ████████╗ ██║       ██████╔╝    ██║    ████████╗ ██║  ╚██╗')}${chalk.magenta('██╗██║ ╚████║███████╗   ██║')}`);
        this.log(`${chalk.green('   ╚═════╝ ')}${chalk.red(' ╚═╝   ╚═╝ ╚═══════╝ ╚═╝       ╚═════╝     ╚═╝    ╚═══════╝ ╚═╝   ╚═╝')}${chalk.magenta('╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝')}\n`);
        this.log(chalk.white.bold('                            https://www.jhipster.tech\n'));
        this.log(chalk.white('Welcome to JHipster.NET ') + chalk.yellow(`v${packagejs.version}`));
        this.log(chalk.white(`Application files will be generated in folder: ${chalk.yellow(process.cwd())}`));
        if (process.cwd() === this.getUserHome()) {
            this.log(chalk.red.bold('\n️⚠️  WARNING ⚠️  You are in your HOME folder!'));
            this.log(
                chalk.red('This can cause problems, you should always create a new directory and run the jhipster command from here.')
            );
            this.log(chalk.white(`See the troubleshooting section at ${chalk.yellow('https://www.jhipster.tech/installation/')}`));
        }
        this.log(
            chalk.green(
                ' _______________________________________________________________________________________________________________\n'
            )
        );
        this.log(
            chalk.white(`  Documentation for creating an application is at ${chalk.yellow('https://www.jhipster.tech/creating-an-app/')}`)
        );
        this.log(
            chalk.white(
                `  If you find JHipster useful, consider sponsoring the project at ${chalk.yellow(
                    'https://opencollective.com/generator-jhipster'
                )}`
            )
        );
        this.log(
            chalk.green(
                ' _______________________________________________________________________________________________________________\n'
            )
        );
    }

    get prompting() {
        return {
            askForModuleName: prompts.askForModuleName,
            askForServerSideOpts: prompts.askForServerSideOpts,

            setSharedConfigOptions() {
                this.configOptions.namespace = this.namespace;
            }
        };
    }

    get configuring() {
        return {
            configureGlobal() {
                this.camelizedBaseName = _.camelCase(this.baseName);
                this.dasherizedBaseName = _.kebabCase(this.baseName);
                this.pascalizedBaseName = toPascalCase(this.baseName);
                this.lowercaseBaseName = this.baseName.toLowerCase();
                this.humanizedBaseName = _.startCase(this.baseName);
                this.solutionName = this.pascalizedBaseName;
                this.mainProjectDir = this.pascalizedBaseName;
                this.testProjectDir = `${this.pascalizedBaseName}${constants.PROJECT_TEST_SUFFIX}`;
            },
            saveConfig() {
                return {
                    saveConfig() {
                        const config = {
                            namespace: this.namespace
                        }
                        this.config.set(config);
                    }
                };
            }
        }
    }

    get default() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._default();
    }

    get writing() {
        return writeFiles.call(this);
    }

    get end() {
        return {
            end() {
                this.log(chalk.green.bold(`\nCreating ${this.solutionName} .Net Core solution.\n`));
                dotnet.newSln(this.solutionName)
                    .then(() => dotnet.slnAdd(`${this.solutionName}.sln`, [
                        'src/JHipsterNet/JHipsterNet.csproj',
                        `${constants.SERVER_SRC_DIR}${this.mainProjectDir}/${this.pascalizedBaseName}.csproj`,
                        `${constants.SERVER_TEST_DIR}${this.testProjectDir}/${this.pascalizedBaseName}${constants.PROJECT_TEST_SUFFIX}.csproj`
                    ]))
                    .catch((err) => {
                        this.warning(`\nFailed to create ${this.solutionName} .Net Core solution: ${err}`);
                    })
                    .finally(() => {
                        this.log(chalk.green.bold('\nServer application generated successfully.\n'));
                        this.log(chalk.green(`Run your .Net Core application:\n${chalk.yellow.bold(`dotnet run --project ./${constants.SERVER_SRC_DIR}${this.mainProjectDir}/${this.pascalizedBaseName}.csproj`)}`));
                    });
            }
        };
    }
};
