import { classList } from "../../utils"

function Button (props) {
  const {
    type,
    size,
    plain,
    round,
    block,
    loading
  } = props
  const className = classList([
    'vc-button',
    type && 'vc-button-type--' + type,
    size && 'vc-button-size--' + size,
    {
      'vc-button--plain': plain,
      'vc-button--round': round,
      'vc-button--block': block,
      'is-loading': loading
    }
  ])

  return (
    <button className={className}
      disabled={props.disabled}
      type={props.nativeType}
      onClick={props.onClick}
      >
      {loading ? (
        <span className="vc-button-icon">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="loading-icon loading-wipe">
            <g>
              <circle cx="25" cy="25" r="20" className="loading-icon-bg-path"></circle>
              <circle cx="25" cy="25" r="20" className="loading-icon-active-path"></circle>
            </g>
          </svg>
        </span>
      ) : null}
      <span>{props.children}</span>
    </button>
  )
}

export default Button
