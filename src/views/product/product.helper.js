export function getOptionCombinations(options, defaultVariant) {
  const result = []

  // Extract option values for up to three options
  const optionValues = options.map((option) => option.optionValue)
  // Handle different cases based on the number of options
  if (optionValues.length === 1) {
    optionValues[0].forEach((value1) => {
      result.push({
        ...defaultVariant,
        option1: value1,
        option2: null,
        option3: null,
        title: `${value1}`,
        variantOptions: [value1],
      })
    })
  } else if (optionValues.length === 2) {
    optionValues[0].forEach((value1) => {
      optionValues[1].forEach((value2) => {
        result.push({
          ...defaultVariant,
          option1: value1,
          option2: value2,
          option3: null,
          title: `${value1} / ${value2}`,
          variantOptions: [value1, value2],
        })
      })
    })
  } else if (optionValues.length === 3) {
    optionValues[0].forEach((value1) => {
      optionValues[1].forEach((value2) => {
        optionValues[2].forEach((value3) => {
          result.push({
            ...defaultVariant,
            option1: value1,
            option2: value2,
            option3: value3,
            title: `${value1} / ${value2} / ${value3}`,
            variantOptions: [value1, value2, value3],
          })
        })
      })
    })
  }

  return result
}
