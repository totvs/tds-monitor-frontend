import { MonitorUser, TdsMonitorServer } from "@totvs/tds-languageclient";
import {
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  query,
} from "lit-element";
import { style } from "../css/monitor-user-list.css";
import { MonitorButton } from "./monitor-button";
import { columnConfig, columnText } from "./monitor-columns";
import { MonitorKillUserDialog } from "./monitor-kill-user-dialog";
import { MonitorOtherActionsDialog } from "./monitor-other-actions-dialog";
import { MonitorSelfRefreshDialog } from "./monitor-self-refresh-dialog";
import { MonitorSendMessageDialog } from "./monitor-send-message-dialog";
import {
  MonitorUserListRow,
  UsersActionOptions,
} from "./monitor-user-list-row";
import {
  HeaderClickEvent,
  MonitorUserListColumnHeader,
  SortOrder,
} from "./monitor-user-list-column-header";
import { sortUsers } from "./util/sort-users";
import { i18n } from "./util/i18n";
import { MonitorColumnsConfigDialog } from "./monitor-columns-config-dialog";

export interface MonitorUserRow extends MonitorUser {
  checked: boolean;
  usernameDisplayed: string;
}

@customElement("monitor-user-list")
export class MonitorUserList extends LitElement {
  @query('monitor-button[icon="chat"]')
  sendMessageButton: MonitorButton;
  sortOrder: SortOrder = SortOrder.Descending;
  sortColumn: ColumnKey = "usernameDisplayed";

  constructor() {
    super();

    this.addEventListener("users-action", this.usersActions);

    const app = document.querySelector("monitor-app");
    if (app.config.sortInfo) {
      let sortOrder_ = SortOrder.Undefined;
      if (app.config.sortInfo.order === "ascending") {
        sortOrder_ = SortOrder.Ascending;
      } else if (app.config.sortInfo.order === "descending") {
        sortOrder_ = SortOrder.Descending;
      }
      this.sortOrder = sortOrder_;
      this.sortColumn = app.config.sortInfo.column;
    }
  }

  @property({ type: Object })
  set server(value: TdsMonitorServer) {
    let oldValue = this._server;
    this._server = value;

    if (this.server.token !== null) {
      this.server.getUsers().then((users) => (this.users = users));
    }

    this.requestUpdate("server", oldValue);
  }
  get server(): TdsMonitorServer {
    return this._server;
  }
  _server: TdsMonitorServer = null;
  _connectionStatus: boolean = false;
  _footerConnectedUser: string;
  _footerUpdateInterval: string;
  _footerLastUpdate: string;
  _sortOrder: number = -1; // Ordenação Padrão (A-Z)

  query: RegExp = null;

  @property({ type: Array })
  get users(): MonitorUser[] {
    const users = Array.from(this._users.values());

    if (this.query !== null)
      return users.filter((user) => findInSearch(user, this.query));

    return users;
  }
  set users(newValue: MonitorUser[]) {
    const newMap = new Map<string, MonitorUserRow>();

    if (newValue !== null) {
      newValue.forEach((user: MonitorUser) => {
        const key = `${user.username}${user.computerName}${user.threadId}${user.server}`;

        if (this._users.has(key)) {
          const oldUser = this._users.get(key);

          newMap.set(key, Object.assign({}, oldUser, user));
        } else {
          const usernameDisplayed = user.appUser || user.username;
          newMap.set(
            key,
            Object.assign(
              { checked: false, usernameDisplayed: usernameDisplayed },
              user
            )
          );
        }
      });
    }

    this._users.clear();
    this._users = newMap;

    this.requestUpdate("users");

    this.updateComplete.then(() => {
      this.requestUpdate("checkAllIcon");
      this.requestUpdate("userSelected");
    });

    var lastUpdate = new Date().toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const app = document.querySelector("monitor-app");
    this._footerConnectedUser =
      newMap.size > 0
        ? newMap.size > 1
          ? i18n.localize(
              "FOOTER_CONNECTED_USERS_MORE",
              "{0} connections",
              newMap.size
            )
          : i18n.localize("FOOTER_CONNECTED_USERS_ONE", "1 connection")
        : i18n.localize("FOOTER_CONNECTED_USERS_NONE", "No connection");
    this._footerUpdateInterval = i18n.localize(
      "FOOTER_UPDATE_INTERVAL",
      "Auto update interval: {0}",
      app.config.updateInterval > 0
        ? i18n.xSeconds(app.config.updateInterval)
        : i18n.disabled()
    );
    this._footerLastUpdate = i18n.localize(
      "FOOTER_UPDATED_AT",
      "Updated at: {0}",
      lastUpdate
    ); //"Atualizado em: " + lastUpdate;
  }

  get rows(): Array<MonitorUserListRow> {
    return Array.from(
      this.renderRoot.querySelectorAll("monitor-user-list-row")
    );
  }

  get columns(): Array<MonitorUserListColumnHeader> {
    return Array.from(
      this.renderRoot.querySelectorAll("monitor-user-list-column-header")
    );
  }

  _users: Map<string, MonitorUserRow> = new Map();
  _searchHandle: number = null;

  @property({ type: Boolean })
  get userSelected(): boolean {
    return (
      this.renderRoot.querySelectorAll("monitor-user-list-row[checked]")
        .length > 0
    );
  }

  static get styles(): CSSResult {
    return style;
  }

  render() {
    let columns = columnConfig()
      .filter((column) => column.visible)
      .map((column) => ({
        id: column.id,
        text: columnText[column.id],
        width: column.width,
      }));

    return html`
      <header>
        <monitor-button
          small
          icon="${this.checkAllIcon}"
          @click="${this.onButtonCheckAllClick}"
        ></monitor-button>
        <mwc-icon-button
          icon="refresh"
          @click="${this.onRefresh}"
          title="${i18n.localize("DO_UPDATE", "Update")}"
        ></mwc-icon-button>
        <mwc-icon-button
          icon="update"
          @click="${this.onSelfRefresh}"
          title="${i18n.localize("DO_AUTO_UPDATE", "Auto update")}"
        ></mwc-icon-button>
        <mwc-icon-button
          icon="chat"
          @click="${this.onButtonSendMessageClick}"
          ?disabled=${!this.userSelected}
          title="${i18n.localize("DO_SEND_MESSAGE", "Send Message")}"
        ></mwc-icon-button>
        <mwc-icon-button
          icon="power_off"
          @click="${this.onButtonKillUserDialogClick}"
          ?disabled=${!this.userSelected}
          title="${i18n.localize("DO_DISCONNECT", "Disconnect")}"
        ></mwc-icon-button>
        <mwc-icon-button
          icon="more_vert"
          @click="${this.onButtonOtherActionsClick}"
          title="${i18n.localize("DO_OTHER_ACTIONS", "Other actions")}"
        ></mwc-icon-button>
        <div></div>
        <monitor-text-input
          outlined
          icon="search"
          @input="${this.onSearchInput}"
        ></monitor-text-input>
      </header>

      <div>
        <table>
          <thead>
            <tr @header-click="${this.onHeaderClick}">
              <th>
                <mwc-icon-button
                  icon="more_vert"
                  @click="${this.onButtonColumnsConfigClick}"
                  title="${i18n.localize(
                    "COLUMNS_CONFIG",
                    "Columns Configuration"
                  )}"
                ></mwc-icon-button>
              </th>
              ${columns.map(
                ({ id, text, width }) => html`
                  <monitor-user-list-column-header
                    id="${id}"
                    caption="${text}"
                    order="${this.sortColumn === id
                      ? this.sortOrder
                      : SortOrder.Undefined}"
                    width=${width}
                  />
                `
              )}
            </tr>
          </thead>

          <tbody>
            ${this.sortedUsers.map((user: MonitorUserRow) => {
              return html`
                <monitor-user-list-row
                  @change="${this.onCheckBoxChanged}"
                  ?checked=${user.checked}
                  usernameDisplayed="${user.usernameDisplayed}"
                  username="${user.username}"
                  environment="${user.environment.toUpperCase()}"
                  computerName="${user.computerName}"
                  threadId="${user.threadId}"
                  server="${user.server}"
                  mainName="${user.mainName}"
                  loginTime="${user.loginTime}"
                  elapsedTime="${user.elapsedTime}"
                  totalInstrCount="${user.totalInstrCount}"
                  instrCountPerSec="${user.instrCountPerSec}"
                  remark="${user.remark}"
                  memUsed="${user.memUsed}"
                  sid="${user.sid}"
                  ctreeTaskId="${user.ctreeTaskId}"
                  inactiveTime="${user.inactiveTime}"
                  clientType="${user.clientType}"
                >
                </monitor-user-list-row>
              `;
            })}
          </tbody>
        </table>
      </div>

      <footer>
        <span class="footer">${this._footerConnectedUser}</span>
        <span class="footer">-</span>
        <span class="footer">${this._footerUpdateInterval}</span>
        <span class="footer">-</span>
        <span class="footer">${this._footerLastUpdate}</span>
      </footer>
    `;
  }

  onHeaderClick(event: HeaderClickEvent) {
    const { column: id, order } = event.detail,
      headers = Array.from(
        this.shadowRoot.querySelectorAll("monitor-user-list-column-header")
      );

    headers
      .filter((column) => column.id !== id)
      .forEach((column) => (column.order = SortOrder.Undefined));

    this.sortColumn = id;
    this.sortOrder = order;

    const app = document.querySelector("monitor-app");
    let sortInfo: SortInfo = {
      column: id,
      order: order.valueOf(),
    };
    app.config = Object.assign<MonitorSettingsConfig, MonitorSettingsConfig>(
      app.config,
      {
        sortInfo,
      }
    );

    app.dispatchEvent(
      new CustomEvent<string>("settings-update", {
        detail: i18n.localize("UPDATE_SETTINGS", "Update settings."),
        bubbles: true,
        composed: true,
      })
    );

    this.requestUpdate("users");
  }

  get sortedUsers() {
    return this.users.sort(sortUsers(this.sortColumn, this.sortOrder));
  }

  usersActions(event: CustomEvent<UsersActionOptions>) {
    let users = event.detail.users;
    if (users && users.length > 0) {
      if (event.detail.action === "send-message") {
        const dialog = new MonitorSendMessageDialog(this.server, users);
        dialog.show();
      } else if (event.detail.action === "kill-user") {
        const dialog = new MonitorKillUserDialog(this.server, users);
        dialog.show();
      }
    }
  }

  /**
   * @author Bardez
   * @description Ordenação de usuários obtidos do webservice
   * @since 28/01/20
   */
  async onSortEnvironment() {
    this._sortOrder *= -1;
    const users = await this.server.getUsers();
    this.users = users;
  }

  onSearchInput(event: Event) {
    if (this._searchHandle !== null) {
      //console.log('canceling animation frame')

      window.clearTimeout(this._searchHandle);
      this._searchHandle = null;
    }

    this._searchHandle = window.setTimeout(() => {
      this._searchHandle = null;

      const text = this.renderRoot.querySelector("monitor-text-input").value;

      if (text.trim() === "") {
        this.query = null;
      } else {
        this.query = new RegExp(text, "i");
      }

      this.requestUpdate("users");
    }, 300);
  }

  onRefresh(event: Event) {
    if (this.server) {
      this.server.getUsers().then((users) => (this.users = users));
    }
  }

  onSelfRefresh(event: Event) {
    let dialog = new MonitorSelfRefreshDialog();
    dialog.show();
  }

  onCheckBoxChanged(event: Event) {
    const row = event.target as MonitorUserListRow,
      key = `${row.username}${row.computerName}${row.threadId}${row.server}`;

    this._users.get(key).checked = row.checked;

    this.requestUpdate("userSelected");
  }

  onButtonSendMessageClick(event: MouseEvent) {
    const users = this.users.filter((row: MonitorUserRow) => row.checked);

    if (users.length === 0) return;

    const dialog = new MonitorSendMessageDialog(this.server, users);
    dialog.show();
  }

  onButtonKillUserDialogClick(event: MouseEvent) {
    const users = this.users.filter((row: MonitorUserRow) => row.checked);

    if (users.length === 0) return;

    const dialog = new MonitorKillUserDialog(this.server, users);
    dialog.show();
  }

  onButtonCheckAllClick(event: MouseEvent) {
    const check = !this.rows.some((row) => row.checked);

    this.users.forEach((user: MonitorUserRow) => (user.checked = check));
    this.requestUpdate("users");

    this.updateComplete.then(() => {
      this.requestUpdate("checkAllIcon");
    });
  }

  onButtonOtherActionsClick(event: MouseEvent) {
    this.server
      .getConnectionStatus()
      .then((status: boolean) => (this._connectionStatus = status))
      .then(() => {
        let dialog = new MonitorOtherActionsDialog(
          this.server,
          this._connectionStatus
        );
        dialog.show();
      });
  }

  onButtonColumnsConfigClick(event: MouseEvent) {
    const dialog = new MonitorColumnsConfigDialog();
    dialog.show();
  }

  @property({ type: String })
  get checkAllIcon(): string {
    const rows = this.rows,
      every = rows.every((row) => row.checked),
      none = !rows.some((row) => row.checked);

    if (none) {
      return "check_box_outline_blank";
    } else if (every) {
      return "check_box";
    } else {
      return "indeterminate_check_box";
    }
  }
}

const findInSearch = (user: MonitorUser, query: RegExp) => {
  return Object.keys(user).some((key: keyof MonitorUser) =>
    query.test(user[key].toString())
  );
};

declare global {
  interface HTMLElementTagNameMap {
    "monitor-user-list": MonitorUserList;
  }
}
