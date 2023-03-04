# with-expo-fonts
Make your expo apps start faster by loading fonts at build time

### Why ✨

`expo-font` load fonts at runtime. This increases the startup time

### iOS ⚠️

Currently it only works on Android. PRs for adding iOS support are welcome

### Installation ⚙️

```bash
expo install with-expo-fonts
```

Add to your plugins on `app.json`

```json
{
  "name": "my app",
  "plugins": ["with-expo-fonts"]
}
```

### Usage 🔨

At the root of your project there is an `assets` folder. Create a `fonts` folder inside it, and place your fonts.

![Screenshot](https://user-images.githubusercontent.com/63297375/222915308-36eabf7e-7618-43cc-893d-92f46550ce6a.png)

Rebuild your app and enjoy :)
