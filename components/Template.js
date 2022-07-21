import Link from "next/link";
import styles from "./Template.module.scss";

const DefaultTemplate =
    (Page) =>
    // eslint-disable-next-line react/display-name
    ({ ...props }) =>
        (
            <>
                <nav className={styles.mainNav}>
                    <Link href="/">
                        <h4>
                            <a>Cape Hackathon: Building ID</a>
                        </h4>
                    </Link>
                </nav>
                <Page {...props} />
            </>
        );

export default DefaultTemplate;
