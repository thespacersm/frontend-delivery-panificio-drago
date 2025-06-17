enum FlottaInCloudPositionTypeEnum {
    POSIZIONE_GPS = 1,
    COLLEGAMENTO_ALIMENTAZIONE = 2,
    SCOLLEGAMENTO_ALIMENTAZIONE = 3,
    INIZIO_VIAGGIO = 4,
    SOSTA = 5,
    MOVIMENTO = 6,
    FERMO = 7,
    INPUT1_ON = 8,
    INPUT1_OFF = 9,
    OUTPUT1_ON = 10,
    OUTPUT1_OFF = 11
}

export default FlottaInCloudPositionTypeEnum;

// Funzione helper per ottenere la descrizione del tipo
export function getPositionTypeDescription(type: number): string {
    switch (type) {
        case FlottaInCloudPositionTypeEnum.POSIZIONE_GPS:
            return "Posizione GPS semplice";
        case FlottaInCloudPositionTypeEnum.COLLEGAMENTO_ALIMENTAZIONE:
            return "Collegamento alimentazione";
        case FlottaInCloudPositionTypeEnum.SCOLLEGAMENTO_ALIMENTAZIONE:
            return "Scollegamento alimentazione";
        case FlottaInCloudPositionTypeEnum.INIZIO_VIAGGIO:
            return "Inizio viaggio";
        case FlottaInCloudPositionTypeEnum.SOSTA:
            return "Sosta";
        case FlottaInCloudPositionTypeEnum.MOVIMENTO:
            return "Movimento";
        case FlottaInCloudPositionTypeEnum.FERMO:
            return "Fermo";
        case FlottaInCloudPositionTypeEnum.INPUT1_ON:
            return "Input 1 ON";
        case FlottaInCloudPositionTypeEnum.INPUT1_OFF:
            return "Input 1 OFF";
        case FlottaInCloudPositionTypeEnum.OUTPUT1_ON:
            return "Output 1 ON";
        case FlottaInCloudPositionTypeEnum.OUTPUT1_OFF:
            return "Output 1 OFF";
        default:
            return "Tipo sconosciuto";
    }
}
