import {Component} from 'react';
import ColorPicker from 'rc-color-picker';
import hexRgb from 'hex-rgb';
import omit from 'lodash.omit';
import ToolbarButton from '../../components/ToolbarButton';
import addMarkOverwrite from '../../changes/mark-addoverwrite';
import { haveMarks } from '../../utils/have';
import { getMarkType } from '../../utils/get';
import { fontBgColor } from '../../constants/marks';
import commonMark from '../../renderer/commonMark';

import 'rc-color-picker/assets/index.css';

class FontBgColorButton extends Component {

  typeName = '';

  constructor(props) {
    super(props);
    this.typeName = this.props.type || fontBgColor;
  }

  static defaultProps = {
    colorKey: 'color'
  };

  onChange = (color) => {
    let { change, onChange, colorKey } = this.props;

    color.rgba = `rgba(${hexRgb(color.color, { format: 'array' }).join(
      ','
    )}, ${color.alpha / 100})`;
    this.setState({ color });
    onChange(
      addMarkOverwrite(change, {
        type: this.typeName,
        data: { [colorKey]: color }
      })
    );
  };

  render() {
    const { icon, change, ...rest } = this.props;
    const isActive = haveMarks(change, this.typeName);
    let colorStyle = {};

    if (isActive) {
      const first = getMarkType(change, this.typeName)
        .first()
        .get('data');
      const color = first.get('color');
      const alpha = first.get('alpha');

      colorStyle = {
        color: color.color
      };
    }

    return (
      <ColorPicker
        onChange={this.onChange}
        placement="bottomRight"
      >
        <ToolbarButton
          icon="format_color_fill"
          title="背景颜色"
          active={isActive}
          iconStyle={colorStyle}
          onClick={e => e.preventDefault()}
        />
      </ColorPicker>
    );
  }

}

function FontBgColorPlugin(opt) {
  const options = Object.assign(
    {
      type: fontBgColor,
      tagName: 'span',
      backgroundColor: mark => mark.data.getIn(['color', 'color'])
    },
    opt
  );

  return {
    toolbarButtons: [
      FontBgColorButton
    ],
    plugins: [
      {
        renderMark: props => {
          if (props.mark.type === options.type)
            return commonMark(options.tagName, omit(options, ['type', 'tagName']))(
              props
            );
        }
      }
    ]
  };
}

export default FontBgColorPlugin;