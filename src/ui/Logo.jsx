import { Link } from "react-router-dom";

export default function Logo({ withLink = false }) {

  const style = [
    "w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform",
    "text-white font-bold text-sm"
  ]
  if (withLink)
    return (
      <Link
        to="/"
        className={style[0]}>
        <span className={style[1]}>G</span>
      </Link>
    );

  return (
    <div
      className={style[0]}>
      <span className={style[1]}>G</span>
    </div >
  )

}