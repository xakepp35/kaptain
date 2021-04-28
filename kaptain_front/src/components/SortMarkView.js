import React from 'react';

const SortMarkView = (props) => {
    switch(props.sortMode) {
        case 1:
          return "🔽"
        case -1:
          return "🔼"
        default:
          return ""
    }
}

export default SortMarkView