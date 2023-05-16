export class SigaaHelper {
    static parseGroupPeriod(horario) {
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
}
