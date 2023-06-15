const webdriver = require("selenium-webdriver");
const ChromeDriverManager = require("chromedriver").ChromeDriverManager;
const { By, until } = webdriver;

// Use ChromeDriverManager to download the latest version of ChromeDriver
const driver = new webdriver.Builder()
    .forBrowser("chrome")
    .setChromeOptions(new webdriver.Capabilities().set("chromeOptions", {
        args: ["--headless", "--disable-gpu", "--window-size=800,600"]
    }))
    .build();

class Disciplina {
    constructor(id, periodo, docente, tipo, modalidade, situacao, horario, local, capacidade, aulas, agrupamento, alunosAtivos) {
        this.id = id;
        this.periodo = periodo;
        this.docente = docente;
        this.tipo = tipo;
        this.modalidade = modalidade;
        this.situacao = situacao;
        this.horario = horario;
        this.local = local;
        this.capacidade = capacidade;
        this.aulas = aulas;
        this.agrupamento = agrupamento;
        this.alunosAtivos = alunosAtivos;
    }
};

(async function main() {
  try {
    await driver.get("https://sigaa.unb.br/sigaa/logar.do?dispatch=logOn");

    // Wait until the element is visible
    await driver.wait(until.elementLocated(By.id("username")), 10000);

    console.log("Successful sign in!");
    
    await driver.wait(until.elementLocated(By.xpath("//h2[text()=' > Consulta geral de turmas']")), 1000000);

    console.log("Successful entered in the 'Consulta geral de turmas' page!");

    const disciplinas = await getDisciplinas();

    await driver.sleep(10000);

    await driver.quit();
  } catch (error) {
    console.error(error);
  }
})();

async function getDisciplinas() {
    current_semester = await driver.findElement(By.xpath("//p[contains(text(), 'Semestre atual:')]")).getText();

    await driver.findElement(By.id("form:checkAnoPeriodo")).click();

    await driver.findElement(By.id("form:inputAno")).sendKeys(current_semester.split(".")[0]);
    await driver.findElement(By.id("form:inputPeriodo")).sendKeys(current_semester.split(".")[0]);

    await driver.findElement(By.id("form:selectUnidade")).click();
    await driver.findElement(By.id("form:selectUnidade")).sendKeys("FACULDADE DO GAMA - BRASÍLIA - 11.01.32");

    await driver.findElement(By.id("form:buttonBuscar")).click();

    const disciplinas = [];

    const trs = await driver.findElements(By.xpath("//table[@id='lista-turmas']/tbody/tr"));
    let id = "";

    console.log("trs: ", trs);

    // await 2 seconds to load the page
    await driver.sleep(2000);

    for (let i = 0; i < trs.length; i++) {
        const tr = trs[i];

        if ((await tr.getAttribute("class")).split(" ")[0] == "destaque") {
            const tds = await tr.findElements(By.xpath("./td"));
            id = await tds[0].getText();
        }

        if ((await tr.getAttribute("class")) == "linhaImpar" || (await tr.getAttribute("class")) == "linhaPar") {
            const tds = await tr.findElements(By.xpath("./td"));
            const periodo = await tds[0].getText();
            const turma = await tds[1].getText();
            const docente = await tds[2].getText();
            const tipo = await tds[3].getText();
            const modalidade = await tds[4].getText();
            const situacao = await tds[5].getText();
            const horario = await tds[6].getText();
            const local = await tds[7].getText();
            const capacidade = getCapacidade(tds);
            const final_id = id + " - " + turma;
            const {total_aulas, agrupamento} = calculateFromhorario(horario);

            // click on the image to view the menu
            await tds[9].click();

            // click on the link to view the students
            await tds[9].findElement(By.xpath("//a[@id='form:sltbtnSelecionarTurma']")).click();
            
            const alunosAtivos = await getAlunosAtivos();

            disciplinas.push(new Disciplina(final_id, periodo, docente, tipo, modalidade, situacao, horario, local, capacidade, total_aulas, agrupamento, alunosAtivos));
        }
    }

    return disciplinas;
}

async function getCapacidade(tds) {
    let capacidade = 0;
    let tmp = await tds[8].getText();

    if (tmp != "") {
        capacidade = parseInt(tmp.split("/")[1]);
    }

    return capacidade;
}

function calculateFromhorario(horario) {
    let inputs = horario.split(" ");
    let agrupamento = "";
    let total_aulas = 0

    for (let input of inputs) {
        let days_number = 0;
        for (let i = 0; i < input.length; i++) {
            let char = input.charAt(i);
            if (isNaN(char)) {
                break;
            }
            days_number += 1;
        }
        let hours_number = input.length - days_number - 1;
        for (let i = 0; i < days_number; i++) {
            agrupamento += String(hours_number) + " ";
            total_aulas += hours_number
        }
    }
    
    agrupamento = agrupamento.trim();

    return {total_aulas, agrupamento};
}

async function getAlunosAtivos() {
    await driver.wait(until.elementLocated(By.xpath("//h2[text()=' > Lista de Alunos da Turma']")), 1000000);

    console.log("Successful entered in the 'Lista geral de turmas' page!");

    // declare hash table alunos
    let alunosMatriculados = [];
    let alunosIndeferidos = [];
    let alunosAtivos = [];
    
    const table = await driver.findElements(By.xpath("//table[@id='lista-turmas']"));

    let lines = await table[0].findElements(By.xpath("./tbody/tr"));

    for (const line of lines) {
        const tds = await line.findElements(By.xpath("./td"));
        const matricula = await tds[0].getText();
        const situacao = await tds[4].getText();

        if (situacao == "CANCELADO") {
            continue;
        }

        alunosMatriculados.push(matricula);
    }

    // ignore the first table
    lines = await table[1].findElements(By.xpath("./tbody/tr"));

    console.log("lines length: ", lines.length);

    let i = 0;

    // collect alunos indeferidos
    for (i = 1; i < lines.length; i++) {
        const line = lines[i];
        const tds = await line.findElements(By.xpath("./td"));

        if (tds.length == 1) {
            i += 1;
            break;
        }

        const matricula = await tds[0].getText();
        alunosIndeferidos.push(matricula);
    }

    // // jump "EXCLUÍDA" section
    // for (; i < lines.length; i++) {
    //     const line = lines[i];
    //     const tds = await line.findElements(By.xpath("./td"));

    //     if (tds.length == 1) {
    //         i += 1;
    //         break;
    //     }
    // };

    // // collect alunos matriculados
    // for (; i < lines.length; i++) {
    //     const line = lines[i];
    //     const tds = await line.findElements(By.xpath("./td"));

    //     if (tds.length == 1) {
    //         break;
    //     }

    //     const matricula = await tds[0].getText();
    //     alunosMatriculados.push(matricula);
    // }

    // AlunosAtivos = AlunosMatriculados - AlunosIndeferidos
    alunosAtivos = alunosMatriculados.filter(x => !alunosIndeferidos.includes(x));

    let alunosRemoved = [];

    // show all alunos that were removed from alunosMatriculados
    for (const aluno of alunosMatriculados) {
        if (!alunosAtivos.includes(aluno)) {
            alunosRemoved.push(aluno);
        }
    }

    console.log("Number of alunosMatriculados: ", alunosMatriculados.length);
    console.log("Alunos removed: ", alunosRemoved);
    console.log("Number of alunosAtivos: ", alunosAtivos.length);

    return alunosAtivos;
}