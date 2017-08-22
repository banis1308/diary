#통합검색 구조 설계

***front***


***backend***
- controller : CMS_SearchController.java
- service : CMS_SearchService.java

controller
1. 왼쪽 사이드메뉴 클릭 시 - content만 바뀐다.
1. 상단 탑메뉴 클릭 시 - lside와 content가 다 바뀐다.

컨트롤러는 왼쪽 클릭을 했는지.. 탑 메뉴를 클릭했는지 알아야 한다.
