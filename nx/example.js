export default {
  type: "container",
  props: {
    x: 123
  },
  children: [{
      type: "container",
      props: {
        y: 456
      },
      children: [{
        type: "logo",
        props: {
          value: 789
        }
      }]
    },
    {
      type: "container",
      props: {
        z: 111
      },
      children: [{
        type: "logo",
        props: {
          value: 111
        }
      }]
    }
  ]
}
