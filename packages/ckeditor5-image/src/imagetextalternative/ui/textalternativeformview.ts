/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imagetextalternative/ui/textalternativeformview
 */

import {
	ButtonView,
	FocusCycler,
	LabeledFieldView,
	View,
	ViewCollection,
	createLabeledInputText,
	injectCssTransitionDisabler,
	submitHandler
} from 'ckeditor5/src/ui';
import { FocusTracker, KeystrokeHandler, type Locale } from 'ckeditor5/src/utils';
import { icons } from 'ckeditor5/src/core';

import '../../../theme/textalternativeform.css';

// See: #8833.
// eslint-disable-next-line ckeditor5-rules/ckeditor-imports
import '@ckeditor/ckeditor5-ui/theme/components/responsive-form/responsiveform.css';

/**
 * The TextAlternativeFormView class.
 *
 * @extends module:ui/view~View
 */
export default class TextAlternativeFormView extends View {
	/**
	 * Tracks information about the DOM focus in the form.
	 *
	 * @readonly
	 * @member {module:utils/focustracker~FocusTracker}
	 */
	public readonly focusTracker: FocusTracker;

	/**
		 * An instance of the {@link module:utils/keystrokehandler~KeystrokeHandler}.
		 *
		 * @readonly
		 * @member {module:utils/keystrokehandler~KeystrokeHandler}
		 */
	public readonly keystrokes: KeystrokeHandler;

	/**
	 * An input with a label.
	 *
	 * @member {module:ui/labeledfield/labeledfieldview~LabeledFieldView} #labeledInput
	 */
	public labeledInput: LabeledFieldView;

	/**
	 * A button used to submit the form.
	 *
	 * @member {module:ui/button/buttonview~ButtonView} #saveButtonView
	 */
	public saveButtonView: ButtonView;

	/**
	 * A button used to cancel the form.
	 *
	 * @member {module:ui/button/buttonview~ButtonView} #cancelButtonView
	 */
	public cancelButtonView: ButtonView;

	/**
	 * A collection of views which can be focused in the form.
	 *
	 * @readonly
	 * @protected
	 * @member {module:ui/viewcollection~ViewCollection}
	 */
	protected readonly _focusables: ViewCollection;

	/**
	 * Helps cycling over {@link #_focusables} in the form.
	 *
	 * @readonly
	 * @protected
	 * @member {module:ui/focuscycler~FocusCycler}
	 */
	protected readonly _focusCycler: FocusCycler;

	/**
	 * @inheritDoc
	 */
	constructor( locale: Locale ) {
		super( locale );

		const t = this.locale!.t;

		this.focusTracker = new FocusTracker();

		this.keystrokes = new KeystrokeHandler();

		this.labeledInput = this._createLabeledInputView();

		this.saveButtonView = this._createButton( t( 'Save' ), icons.check, 'ck-button-save' );
		this.saveButtonView.type = 'submit';

		this.cancelButtonView = this._createButton( t( 'Cancel' ), icons.cancel, 'ck-button-cancel', 'cancel' );

		this._focusables = new ViewCollection();

		this._focusCycler = new FocusCycler( {
			focusables: this._focusables,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				// Navigate form fields backwards using the Shift + Tab keystroke.
				focusPrevious: 'shift + tab',

				// Navigate form fields forwards using the Tab key.
				focusNext: 'tab'
			}
		} );

		this.setTemplate( {
			tag: 'form',

			attributes: {
				class: [
					'ck',
					'ck-text-alternative-form',
					'ck-responsive-form'
				],

				// https://github.com/ckeditor/ckeditor5-image/issues/40
				tabindex: '-1'
			},

			children: [
				this.labeledInput,
				this.saveButtonView,
				this.cancelButtonView
			]
		} );

		injectCssTransitionDisabler( this );
	}

	/**
	 * @inheritDoc
	 */
	public override render(): void {
		super.render();

		this.keystrokes.listenTo( this.element! );

		submitHandler( { view: this } );

		[ this.labeledInput, this.saveButtonView, this.cancelButtonView ]
			.forEach( v => {
				// Register the view as focusable.
				this._focusables.add( v );

				// Register the view in the focus tracker.
				this.focusTracker.add( v.element! );
			} );
	}

	/**
	 * @inheritDoc
	 */
	public override destroy(): void {
		super.destroy();

		this.focusTracker.destroy();
		this.keystrokes.destroy();
	}

	/**
	 * Creates the button view.
	 *
	 * @param label The button label
	 * @param icon The button's icon.
	 * @param className The additional button CSS class name.
	 * @param eventName The event name that the ButtonView#execute event will be delegated to.
	 * @returns The button view instance.
	 */
	private _createButton( label: string, icon: string, className: string, eventName?: string ): ButtonView {
		const button = new ButtonView( this.locale );

		button.set( {
			label,
			icon,
			tooltip: true
		} );

		button.extendTemplate( {
			attributes: {
				class: className
			}
		} );

		if ( eventName ) {
			button.delegate( 'execute' ).to( this, eventName );
		}

		return button;
	}

	/**
	 * Creates an input with a label.
	 *
	 * @returns Labeled field view instance.
	 */
	private _createLabeledInputView(): LabeledFieldView {
		const t = this.locale!.t;
		const labeledInput = new LabeledFieldView( this.locale, createLabeledInputText );

		labeledInput.label = t( 'Text alternative' );

		return labeledInput;
	}
}