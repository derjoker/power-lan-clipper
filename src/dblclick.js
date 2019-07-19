const engine = 'https://de.langenscheidt.com/deutsch-englisch/';

window.addEventListener('dblclick', function () {
  const selection =
    window.getSelection() ||
    document.getSelection() ||
    document.selection.createRange();

  if (selection.toString().trim()) {
    const link = engine + selection;
    console.log(link);
    window.open(link);
  }
});