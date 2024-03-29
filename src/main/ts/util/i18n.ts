export class I18n {
	private _translations: any = window.storage.translations();
	private _company: any = window.storage.company();

	public get translations(): any {
		return this._translations;
	}

	public set company(value: string) {
		this._company = value || "********";
	}

	public get company(): any {
		return this._company;
	}

	public set translations(value: any) {
		this._translations = value || {};
	}

	public localize(
		key: string,
		message: string,
		...args: (string | number | boolean | undefined | null)[]
	): string {
		let result = message;

		if (this._translations.hasOwnProperty(key)) {
			result = this._translations[key];
		}

		if (args && args.length > 0) {
			args.forEach((arg: any, index: number) => {
				result = result.replace(
					"{" + index + "}",
					"" + (args[index] || "null")
				);
			});
		}

		return result;
	}

	public totvsMonitorIcon(): string {
		return "./" + this._company + "/app_logo_neg_pb.svg";
	}

	public totvsMonitor(): string {
		return this.localize("TOTVS_MONITOR", "TOTVS Monitor");
	}

	public ok(): string {
		return this.localize("OK", "Ok");
	}

	public confirm(): string {
		return this.localize("CONFIRM", "Confirm");
	}

	public cancel(): string {
		return this.localize("CANCEL", "Cancel");
	}

	public yes(): string {
		return this.localize("YES", "Yes");
	}

	public no(): string {
		return this.localize("NO", "No");
	}

	public enable(): string {
		return this.localize("ENABLE", "Enable");
	}

	public disable(): string {
		return this.localize("DISABLE", "Disable");
	}

	public disabled(): string {
		return this.localize("DISABLED", "Disabled");
	}

	public xSeconds(seconds: number): string {
		return this.localize("X_SECONDS", "{0} seconds", seconds);
	}

	public close(): string {
		return this.localize("CLOSE", "Close");
	}

	public protheus(): string {
		return this.localize("PROTHEUS", "Protheus");
	}

	public logix(): string {
		return this.localize("LOGIX", "Logix");
	}

	// Apenas para manter a consistencia nas labels de encoding
	public CP1252(): string {
		return "CP1252";
	}

	public CP1251(): string {
		return "CP1251";
	}

	public UTF8(): string {
		return "UTF-8";
	}
}

export const i18n = new I18n();
