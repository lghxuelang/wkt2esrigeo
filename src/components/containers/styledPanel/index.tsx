import React from 'react';
import classes from 'classnames';
import styles from './index.less';

interface PropTypes {
  className?: string,
  style?: React.StyleHTMLAttributes<HTMLDivElement>,
  children?: JSX.Element | React.Component,
};

const StyledPanel: React.FC<PropTypes> = (props: PropTypes) => {
  return (
    <div className={classes(styles.wrap, props.className)} style={props.style}>
      <div className={styles.styled}>
        <span className={styles.style1} />
        <span className={styles.style2} />
        <span className={styles.style3} />
        <span className={styles.style4} />
      </div>
      {props.children}
    </div>
  );
};

export default StyledPanel;
