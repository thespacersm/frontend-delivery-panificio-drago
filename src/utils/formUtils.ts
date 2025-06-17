/**
 * Aggiorna i dati del form gestendo proprietà annidate come 'acf.campo' o 'title.raw'
 * 
 * @param formData Dati attuali del form
 * @param name Nome del campo (può contenere punti per proprietà annidate)
 * @param value Nuovo valore del campo
 * @param type Tipo dell'input (opzionale, usato per gestire checkbox)
 * @returns Nuova copia dell'oggetto formData con il campo aggiornato
 */
export function updateFormData<T>(formData: T, name: string, value: any, type?: string, checked?: boolean): T {
  let newFormData = { ...formData } as any;  
  // Per i checkbox, gestiamo i valori booleani direttamente
  let finalValue = value;

  if(type === 'checkbox') {
    finalValue = checked !== undefined ? checked : value;
  }

  if (name.includes('.')) {
    // Gestione proprietà annidate (es. acf.campo, title.raw)
    const [prefix, field] = name.split('.');
    
    if (prefix === 'acf') {
      newFormData.acf = {
        ...newFormData.acf,
        [field]: finalValue
      };
    } else if (prefix === 'title') {
      newFormData.title = {
        ...newFormData.title,
        [field]: finalValue
      };
    } else {
      // Supporto per altre proprietà annidate
      if (!newFormData[prefix]) newFormData[prefix] = {};
      newFormData[prefix][field] = finalValue;
    }
  } else {
    // Gestione proprietà di primo livello
    newFormData[name] = finalValue;
  }
  
  return newFormData;
}
