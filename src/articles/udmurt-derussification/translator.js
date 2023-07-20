const textarea = document.getElementById('transl-textarea');
const clearBtn = document.getElementById('transl-clear');
const output = document.getElementById('transl-output');

clearBtn.addEventListener('click', (ev) => {
  textarea.value = '';
  output.textContent = '';
});

window._getLatin().then(({ translate }) => {
  textarea.addEventListener('input', (ev) => {
    output.textContent = translate(textarea.value);
  });
})
