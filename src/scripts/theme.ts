type Theme = 'light' | 'dark';

const opposite = (t: Theme) => ({
  light: 'dark',
  dark: 'light',
}[t]) as Theme;

export default function (switcher: HTMLElement) {
  let currentTheme: Theme =
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  const setButtons = (t: Theme) => {
    switcher.setAttribute('title', {
      light: 'Пеймыт тэмаез пуктоно',
      dark: 'Югыт тэмаез пуктоно',
    }[t]);

    switcher.innerHTML = feather.icons[{
      light: 'moon',
      dark: 'sun',
    }[t]].toSvg();
  };

  const switchTheme = (t: Theme | null) => {
    setButtons(t || currentTheme);

    if (t == null)
      return;

    currentTheme = t;

    localStorage.setItem('userTheme', t);
    document.documentElement.classList.remove(opposite(t));
    document.documentElement.classList.add(t);
  };

  switcher.addEventListener('click', () => {
    switchTheme(opposite(currentTheme));
  });

  switchTheme(localStorage.getItem('userTheme') as Theme);
}