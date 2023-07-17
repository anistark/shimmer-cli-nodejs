import chalk from 'chalk';
import boxen from 'boxen';

const ShimmyLogo = chalk.white.bold(
    "@@@@@@@@@     @@@@@@",
    "@@@@               @",
    "@@      @@@@@@@   %@",
    "@     @@@@@@@@@&  &@",
    "    .@@@@@@@@@&    *",
    "    .@@@@@@@@@@@    ",
    "@    &@@@@@@@@@@    ",
    "@@    @@@@@@@@@*    ",
    "@@@ @@@@@@@@@*     @",
    "@                @@@",
    "@@@@          @@@@@@"
);

export async function printBox(text, title) {
    console.log(boxen(
        chalk.white.bold(text),
        {
            title: title,
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "green",
            titleAlignment: 'center'
        }
    ));
}

export const clearLastLine = () => {
    process.stdout.moveCursor(0, -1) // up one line
    process.stdout.clearLine(1) // from cursor to end
}
