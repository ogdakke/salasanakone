import styles from "../../styles/modules/Loading.module.css";

export function Loading() {
    return (
        <div className={styles.loading} aria-busy="true">
            {/* <span role="progressbar" aria-label="Loader animation" className="loader"></span> */}
        </div>
    );
}
