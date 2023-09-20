import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
export default function Icon({icon}) {
  return (
    <FontAwesomeIcon icon={Icons["fa" + icon]} />
  )
}
