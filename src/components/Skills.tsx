import ui from "./ui.module.css";

/** "+ LangGraph  + LLM" list; each skill wraps as a whole word. */
export function Skills({
  skills,
  className,
}: {
  skills: readonly string[];
  className?: string;
}) {
  return (
    <ul className={`${ui.skills} ${className ?? ""}`}>
      {skills.map((skill) => (
        <li key={skill}>
          <span className={ui.plus} aria-hidden="true">
            +{" "}
          </span>
          {skill}
        </li>
      ))}
    </ul>
  );
}
