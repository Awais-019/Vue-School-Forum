const ClickOutsideDirective = {
  mounted (el, binding) {
    el.__clickOutsideHandler__ = (e) => {
      if (!(el === e.target || el.contains(e.target))) {
        binding.value(e)
      }
    }
    document.body.addEventListener('click', el.__clickOutsideHandler__)
  },
  unmounted (el) {
    document.body.removeEventListener('click', el.__clickOutsideHandler__)
  }
}

export default (app) => {
  app.directive('click-outside', ClickOutsideDirective)
}
