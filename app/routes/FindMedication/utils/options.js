function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function getActiveOptions(options, activeMedicationTypes) {
  if(!options || isEmpty(options) || !activeMedicationTypes){
    return {};
  }

  activeMedicationTypes.sort()

  let activeOption = {}

  for(var i=0;i<options.options.length;i++){
    const option = options.options[i];

    let medicationTypeIds = []

    for(var j=0;j<option.medicationTypes.length;j++){
      medicationTypeIds.push(option.medicationTypes[j].id)
    }

    if(medicationTypeIds.length != activeMedicationTypes.length){
      continue;
    }

    medicationTypeIds.sort()

    let array_equal = true

    for(var j=0;j<medicationTypeIds.length;j++){
      if(medicationTypeIds[j] != activeMedicationTypes[j]){
        array_equal = false
      }
    }

    if(array_equal){
      activeOption = option;
    }
  }

  if(activeOption.medicationNames){
    activeOption.medicationDosages = {}

    for(var i=0;i<activeOption.medicationNames.length;i++){
      let medId = activeOption.medicationNames[i].id
      activeOption.medicationNames[i].value = medId
      activeOption.medicationNames[i].label = activeOption.medicationNames[i].name

      let dosages = activeOption.medicationNames[i].dosages

      for(var j=0;j<dosages.length;j++){
        dosages[j].value = dosages[j].id
        dosages[j].label = dosages[j].name
      }

      activeOption.medicationDosages[medId] = dosages
    }
  }

  return activeOption;
}
