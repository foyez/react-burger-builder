Code inside componentDidMount run once when the component is mounted. useEffect hook equivalent for this behaviour is

```js
useEffect(() => {
  // Your code here
}, []);
```
Notice the second parameter here (empty array). This will run only once.

Without the second parameter the useEffect hook will be called on every render of the component which can be dangerous.

```js
useEffect(() => {
  // Your code here
});
```

componentWillUnmount is use for cleanup (like removing event listners, cancel the timer etc). Say you are adding a event listner in componentDidMount and remvoing it in componentWillUnmount as below.

```js
componentDidMount() {
  window.addEventListener('mousemove', () => {})
}

componentWillUnmount() {
  window.removeEventListener('mousemove', () => {})
}
```

Hook equivalent of above code will be as follows

```js
useEffect(() => {
  window.addEventListener('mousemove', () => {});

  // returned function will be called on component unmount 
  return () => {
    window.removeEventListener('mousemove', () => {})
  }
}, [])
```