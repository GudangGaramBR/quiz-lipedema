window.STEP_12_RESTRICCION = {
  type: "question",
  id: "restriccion_alimentaria",
  showOptionDesc: false,

  text: "¿Tienes alguna restricción alimentaria?",
  subtitle: "Selecciona la opción que mejor se adapte a tu situación.",
  options: [
    {
      value: "restricciones",
      icon: "🍽️",
      label: "Sí, tengo restricciones y evito algunos alimentos",
      desc: "Esto puede influir directamente en la inflamación y los resultados."
    },
    {
      value: "sin_restricciones",
      icon: "😊",
      label: "No, como de todo sin problemas",
      desc: "Algunos alimentos pueden estar afectándote sin que lo notes."
    },
    {
      value: "alimentos_malestar",
      icon: "🤢",
      label: "Algunos alimentos me hacen sentir mal",
      desc: "Identificar estos alimentos es clave para reducir la hinchazón."
    },
    {
      value: "no_segura",
      icon: "🤔",
      label: "No estoy segura, nunca he prestado atención a eso",
      desc: "Muchas mujeres descubren esto solo cuando ajustan la alimentación."
    }
  ]
};
