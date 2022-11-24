import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { faBars, faHome } from "@fortawesome/free-solid-svg-icons";
import { Select, Store } from "@ngxs/store";
import { environment } from "projects/seta-web/src/environments/environment";
import { Observable } from "rxjs";
import { SetaDocument } from "../../models/document.model";
import { User } from "../../models/user.model";
import { AuthenticationService } from "../../services/authentication.service";
import { SetaStateCorpus } from "../../store/seta-corpus.state";
declare var $: any;

@Component({
    selector: `app-main-navbar`,
    templateUrl: `./main-navbar.component.html`,
    styleUrls: [`./main-navbar.component.scss`]
})
export class MainNavbarComponent implements OnInit {
    @Select(SetaStateCorpus.corpusDocuments)
    corpusDocuments$: Observable<SetaDocument[]>;

    faBars = faBars;
    faHome = faHome;

    isFormPresent = false;

    docId: string;

    sidebar = false;

    apiUrl = environment.baseUrl.replace(`api/v1`, `doc`);
    isSearchFormActive = false;
    ne: NavigationEnd = null;

    user: User;

    constructor(private httpClient: HttpClient, private store: Store, private router: Router, private auth: AuthenticationService) {
        this.corpusDocuments$.subscribe((docList: SetaDocument[]) => {
            if (docList.length !== 0) {
                this.docId = docList[0].id;
            }
        });
    }

    ngOnInit() {
        if (this.ne !== null) {
        }
        $(`.navbar-nav>li>a`).on(`click`, () => {
            $(`.navbar-collapse`).collapse(`hide`);
        });

        this.auth.currentUserSubject.asObservable().subscribe((user: User) => {
            this.user = user
        })
    }

    toggleSidebar() {
        this.sidebar = !this.sidebar;
    }

    goToLink(event: any, link: string) {
        window.open(`${environment.baseUrl}${link}`, `_blank`);
        event.preventDefault();
    }

}
