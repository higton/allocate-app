declare module 'src/util/sigaa-helper' {
    export class SigaaHelper {
        static parseGroupPeriod(groupPeriod: String): {
            total_aulas: number;
            agrupamento: number;
        };
    }
}