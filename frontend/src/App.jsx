import React from 'react';

function App() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Wig Lud</h1>
      </header>
      <main style={styles.main}>
        <p>This is a simple React app powered by Vite.</p>
      </main>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    backgroundColor: '#282c34',
    padding: '20px',
    color: 'white',
  },
  main: {
    padding: '20px',
  },
};

export default App;
