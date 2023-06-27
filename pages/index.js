import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import React, { useEffect, useState } from "react";

/*
Some features/benifits of next JS:
1. Project structure developer friendly and clean.
2. Routing system - next js supports client side routing and server side routing even also support from file system.
3. Search Engine Optimization (SEO)
4. Environment Variable (.env)
5. Server-Side Rendering (SSR): enables server-side rendering, allowing to generate HTML on the server and send it to the client. This helps improve performance, SEO, and provides a better initial page load experience.
6. Static Site Generation (SSG): supports static site generation, where pages are pre-built at build time. This enables to generate static HTML files for each page, which can be served directly from a CDN for maximum performance and scalability.
7. Automatic Code Splitting: automatically splits JavaScript code into smaller chunks, optimizing the loading of only the required code for each page. This helps reduce initial page load times and improves performance.
8. Hot Module Replacement (HMR): supports HMR, which allows to see the changes you make in your code instantly without having to manually refresh the page. This significantly speeds up the development workflow.
9. API Routes: it provides a built-in API routing system that allows to create serverless API endpoints within Next.js application. This makes it easy to handle API requests and server-side logic without setting up a separate backend server.
10. CSS and Sass support: it has built-in support for importing CSS and Sass files, making it easy to style your components. It also supports CSS modules, which enable scoped styles for better modularity.
11. Automatic Routing: it automatically generates routes based on the file system structure. You can create a new file in the pages directory, and Next.js will automatically create a corresponding route for it.
12. TypeScript Support:it has excellent TypeScript integration, allowing you to write your code using TypeScript for static type checking and improved developer experience.
*/

function ActionItem({ label, action, handleChange }) {
  return (
    <li>
      {label}
      <a
        href="#"
        onClick={function (e) {
          e.preventDefault();
          handleChange(label);
        }}
        style={{ float: "right", marginLeft: "1rem" }}
      >
        {action}
      </a>
    </li>
  );
}

function ActionItemWithLink({ label, href, action, handleChange }) {
  return (
    <li>
      <Link href={href}>{label}</Link>

      <a
        href="#"
        onClick={function (e) {
          e.preventDefault();
          handleChange(label);
        }}
        style={{ float: "right", marginLeft: "1rem" }}
      >
        {action}
      </a>
    </li>
  );
}

const SelectedCountryCard = ({ countryList, removeHandler }) => (
  <div className={styles.card}>
    <h2>Selected</h2>
    <ul>
      {countryList.map((c) => (
        <ActionItem key={c} label={c} action="-" handleChange={removeHandler} />
      ))}
    </ul>
  </div>
);

const AvailableCountryCard = ({
  countryList,
  alreadyAddedList,
  addHandler,
}) => (
  <div className={styles.card}>
    <h2>Choose From</h2>
    <ul>
      {countryList
        .filter((c) => !alreadyAddedList.includes(c.name))
        .map((c) => (
          <ActionItemWithLink
            key={c.name}
            label={c.name}
            href={`/countries/${c.alpha3Code}`}
            action="+"
            handleChange={addHandler}
          />
        ))}
    </ul>
  </div>
);

export default function Home({ allCountries }) {
  const [selectedCountries, setSelectedCountries] = useState([]);

  function handleAdd(country) {
    setSelectedCountries(selectedCountries.concat(country));
  }

  function handleRemove(country) {
    const updatedList = selectedCountries.filter((c) => c !== country);
    setSelectedCountries(updatedList);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Next Lab</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Tour Master!</h1>

        <div className={styles.grid}>
          <SelectedCountryCard
            countryList={selectedCountries}
            removeHandler={handleRemove}
          />

          <AvailableCountryCard
            countryList={allCountries}
            alreadyAddedList={selectedCountries}
            addHandler={handleAdd}
          />
        </div>
      </main>
    </div>
  );
}

// getServerSideProps()
export async function getStaticProps() {
  console.log("Going to fetch all countries");
  const response = await fetch("https://restcountries.com/v3.1/all");
  if (!response.ok) {
    console.log("fetch was unsuccessful");
    return;
  }

  const result = await response.json();
  console.log("Fetched countries:", result.length);

  const countries = result.map((item) => ({
    name: item.name.common,
    alpha3Code: item.cca2,
  }));

  return {
    props: {
      allCountries: countries,
    },
  };
}
