import React, { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidemenu = ({ valor }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  useEffect(() => {
    const currentRoute = valor.menu.find((item) => item.link === router.pathname);
    if (currentRoute) {
      setSelectedOption(currentRoute.id);
    }
  }, [router.pathname, valor.menu]);

  return (
    <div className={styles.MenuOpt}>
      {valor.menu.map((item) => (
        <Link key={item.id} href={item.link}>
          <div
            className={`${styles.option} ${selectedOption === item.id ? styles.selected : ''}`}
            onClick={() => handleOptionClick(item.id)}            
          >
            <div className={styles.iconsidebar}>
              {<item.icon/>}
            </div>
            <span>{item.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Sidemenu;
