react + redux app to view the structure of a psd file and copy css from it. Made using [ag-psd](https://github.com/Agamnentzar/ag-psd).

Meant mostly for a situation in which styles from multiple arboards have to be extracted, in a format like this:

```
.b300x600 {
  .logo {
    //left, top, with, height, font-size, etc.
  }
  .offer {}
}
.b300x250 {
  .logo {}
  .offer {}
}
```

deployed at (https://psd-online.vercel.app/)
