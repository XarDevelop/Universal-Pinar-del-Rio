import { Link } from 'react-router-dom'
import './PapeleraButton.css'

export default function PapeleraButton() {
  return (
    <div>
        <Link
        className='papelera'
        to={'/Papelera'}>Visitar Papelera</Link>
    </div>
  )
}
