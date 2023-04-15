/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module essentials/essentials
 */

import { Plugin } from '@ckeditor/ckeditor5-core';

import { Clipboard } from '@ckeditor/ckeditor5-clipboard';
import { Enter, ShiftEnter } from '@ckeditor/ckeditor5-enter';
import { SelectAll } from '@ckeditor/ckeditor5-select-all';
import { Typing } from '@ckeditor/ckeditor5-typing';
import { Undo } from '@ckeditor/ckeditor5-undo';

/**
 * A plugin including all essential editing features. It represents a set of features that enables similar functionalities
 * to a `<textarea>` element.
 *
 * It includes:
 *
 * * {@link module:clipboard/clipboard~Clipboard},
 * * {@link module:enter/enter~Enter},
 * * {@link module:select-all/selectall~SelectAll},
 * * {@link module:enter/shiftenter~ShiftEnter},
 * * {@link module:typing/typing~Typing},
 * * {@link module:undo/undo~Undo}.
 *
 * This plugin set does not define any block-level containers (such as {@link module:paragraph/paragraph~Paragraph}).
 * If your editor is supposed to handle block content, make sure to include it.
 */
export default class Essentials extends Plugin {
	/**
	 * @inheritDoc
	 */
	public static get requires() {
		return [ Clipboard, Enter, SelectAll, ShiftEnter, Typing, Undo ] as const;
	}

	/**
	 * @inheritDoc
	 */
	public static get pluginName(): 'Essentials' {
		return 'Essentials';
	}
}
