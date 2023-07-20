import styles from "../../styles/modules/Divider.module.css";

export const Divider = (margin: { margin: string }, { ...props }) => {
    return (
        <hr
            className={styles.divider}
            style={{ margin: margin.margin }}
            {...props}
        />
    );
};
