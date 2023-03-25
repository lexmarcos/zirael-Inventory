export const weightsAndVolumes = {
  weights: {
    name: "Peso",
    options: [
      {
        name: "Quilograma",
        abbreviation: "kg",
        symbol: "kg",
        plural: "quilogramas",
      },
      {
        name: "Grama",
        abbreviation: "g",
        symbol: "g",
        plural: "gramas",
      },
      {
        name: "Miligrama",
        abbreviation: "mg",
        symbol: "mg",
        plural: "miligramas",
      },
    ],
  },
  volumes: {
    name: "Volume",
    options: [
      {
        name: "Litro",
        abbreviation: "l",
        symbol: "L",
        plural: "litros",
      },
      {
        name: "Mililitro",
        abbreviation: "ml",
        symbol: "mL",
        plural: "mililitros",
      },
    ],
  },
};

export const normalizedWeightsAndVolumes = Object.entries(weightsAndVolumes).map((item) => {
  const subItem = Object.entries(item[1]);
  return {
    name: subItem[0][1] as string,
    options: subItem[1][1] as {
      name: string;
      abbreviation: string;
      symbol: string;
      plural: string;
    }[],
  };
});
