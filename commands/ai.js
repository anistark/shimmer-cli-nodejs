import inquirer from 'inquirer';

import 'dotenv/config';

export async function aiPrompt() {
    inquirer
    .prompt([
        {
        type: 'input',
        name: 'favColor',
        message: 'What is your favorite color?',
        default: 'Blue'
        },
    ])
    .then(answers => {
        console.info('Your answer are :', JSON.stringify(answers));
        // Do Something.
    });
}
