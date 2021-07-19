---
title: XKB Configuration Hell
lang: en
date: 2021-07-12
cover:
    url: cover.jpg
    alt: A keyboard, three keys in the center say “XKB”
abstract: >
    X Keyboard provides vast possibilities to customize your typing, but you'll 
    first need to find a way to them.
---

<aside>

TL;DR: If you're using NixOS, ready module is available in my [flake].

</aside>

XKB (X Keyboard) is the part of Linux graphical environment responsible for 
comfortable usage of keyboard. Thanks to it we have, for example, different 
languages and layouts.

It's clear from its name that XKB appeared when XFree86 was emerging. But even 
now, as Wayland is coming to us, XKB remains a part of our systems. Meanwhile 
the documentation doesn't seem to have gone far since then.

## The problem

{% image 
"https://ilyabirman.ru/projects/typography-layout/i/layout-win@2x.png", "", 
"Ilya Birman's typographic layout" %}

I'm using [Ilya Birman's typographic layout][ilya-birman] for a while now (no 
ads.) It's quite easy to type in different symbols with diacritics with it. But 
it seems missing on Linux… or is it?

For some time there is `misc:typo` option in XKB which is said to be based on 
the typographic layout. However there are no dead keys (the exact keys allowing 
to type in diacritics.) I don't know the reason for it—perhaps, not to
plagiarize the work of Ilya Birman (we're in free software after all!), or 
because it wasn't international enough. Whatever the why is, I needed to do 
something with it.

There is a [layout prepared for Ubuntu][ubuntu] on the Internet. It isn't 
flawless either as it lacks a couple of symbols. Furthermore, when XKB is 
updated once in a blue moon, it's needed to reapply the modifications anew. So 
I decided to dive in myself.

## Configuration

Layouts and options are all symbol sets. In addition to it XKB cares about key 
presses and interpreting the codes coming from keyboard but we're not 
interested in that.

Layouts are covering most of the keys, and options are covering only a partion 
being some kind of a mixin to the former. More than that, as they are a single 
entity, you can include one inside the other.

```
/usr/share/X11/xkb/symbols/us

// This is a layout.
// The first three keywords are not interesting to us, they simply mean that 
// the layout covers only a part of the alphanumeric keys.
partial alphanumeric_keys default
xkb_symbols "basic" {
  keys <AD01> { [ q, Q ] };
  keys <AD02> { [ w, W ] };
  // and so on
};

/usr/share/X11/xkb/symbols/typo

// This is an option.
partial alphanumeric_keys
xkb_symbols "deadkeys" {
  // Symbol sets are at most composed from four levels which are activated as 
  // follows:
  //                 1.        2.        3.         4.
  //                         Shift     AltGr    Shift+AltGr
  keys <AD01> { [ NoSymbol, NoSymbol, NoSymbol, dead_breve ] };
  keys <AD04> { [ NoSymbol, NoSymbol, NoSymbol, dead_abovering ] };
  // and so on
};

// And here everything is put all together
partial alphanumeric_keys
xkb_symbols "layout_extra" {
  include "us(basic)+deadkeys+level3(ralt_switch)"
};
```

The above adds `layout_extra` layout. Pressing simultaneously AltGr (the right 
Alt) and big Q should give us breve symbol which would compose on top of any 
symbol entered next (as in letter Й.) `layout_extra` explicitly includes 
`level3(ralt_switch)` option so that AltGr is the key to move to the third 
level, there are other option (differing from Windows IIRC.)

This part isn't any hard, the question is only to sit a while writing the 
symbols (and don't forget the semicolon after the `xkb_symbols` definition.) 
The hard part is to make it visible to the system.

Everything in XKB makes its way to the big list of rules. Usually it is 
`rules/evdev` (there are other.) In that file it's written when, how and where 
is one or the other symbol list activated.

You can look for the layouts in the aforementioned [layout for Ubuntu][layout]. 
I'll explain the options here.

## Rules

Every options appears at least in one section:

```
/usr/share/X11/xkb/rules/evdev

! option = symbols
  grp:shift_toggle = +group(shifts_toggle)
  grp:switch = +group(grp_switch)
  // etc.
```

Here, symbol list from the second column becomes visible by the name in the 
first column. And now it's available through `setxkbmap` or other user 
interface.

```
$ setxkbmap -option grp:shift_toggle
```

By the way, these options (`grp:*`) define the way to switch groups. All the 
different layouts are in fact symbol groups laid one on top of the other, even 
if it isn't said so to the user. These symbols groups form one big layout.

{% image "groups.jpg", "Underneath is English group +en:1, atop is Russian 
+ru:2", "English and Russian groups" %}

The typographic layout was meant to apply on top of English and Russian 
layouts. But not so fast.

As Russian and English are different symbol groups, it's needed to apply the 
option to each one separately. Otherwise it would be usable only in the English 
layout (if it's the first one.)

Digging through the rule file, I found out that `misc:typo` and one another 
option are special. They're implicitly applied to every symbol group. And it's 
written as follows:

```
! layout    option    = symbols
  *         misc:typo   +typo(base)

! layout[1] option    = symbols
  *         misc:typo   +typo(base):1

! layout[2] option    = symbols
  *         misc:typo   +typo(base):2

// and this way to four
```

In other words, for each symbol group in case of `misc:typo` enabled the symbol 
set in question is applied shifted to the specified amount (`+...:n`.)

So, to make the newly created dead keys available you need to add these lines 
(changing the name and `n` accordingly.)

```
  en <name> = +typo(deadkeys):n
  ru <name> = +typo(deadkeys):n
```

[flake]: https://github.com/kotwys/lymypyry/blob/main/modules/extra-xkb-options.nix
[ilya-birman]: https://ilyabirman.ru/projects/typography-layout/
[ubuntu]: https://github.com/neochief/birman-typography-layouts-for-ubuntu
