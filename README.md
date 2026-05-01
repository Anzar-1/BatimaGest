# BatimaGest
Ce projet a pour but de faciliter les signalement de problème dans une résidence quelconque. Un résident possède un tableau de bord, ou il peut voir ses propres signalement, voir le nombre de signalement par partie communes, et signaler quelque chose. Un membre du staff peut consulter les signalement déposé,et modifier l'état de leurs avancées.

#Mapping des tables:
Il y a 4 tables, dont une supplementaires qui represente les "notifications".
Table A: La table "Resident". C'est la table utilisateur, et tout les utilisateur (que ça soit normaux, staff, ou superuser) partagent les attributs de cette table.
Table B: La table "partieCommune": C'est une table qui contient une liste des parties communes disponibles dans la résidence. Elle peut être étandue comme bon nous semble à condition que changer quelques petites chose dans la template "partieC.html"
Table C: Table "Signalements": Elle contient des réfèrence au soumetteur (résident) et a la partie commune. Elle a aussi deux classes interne (etat, priorite). Elle contient aussi la date de publication.

#Analyse de l'architecture:

Le hosting d'une SupaBase et sur Vercel s'inscrit dans l'OPEX. Là ou le hosting dans des serveurs classic s'incrivent plutôt dans le CAPEX (en ce qui concerne l'achat du matériel, mais OPEX pour sa maintenance). Le premier est partiquement gratuit si on vient a le comparer au dépense liée à l'installation d'un serveur.

Un serveur physique est difficilement scalable. En effet, en plus d'être cher a la maintenance (climatisation, électricité...), si le nombre d'ulisateur augmente, de nouveaux serveurs doivent être installés (ce qui est couteux en terme d'argent et de temps). Là ou le hosting dans un service d'une compagnie élimine se problème étant donné qu'il n'est plus géré par nous, mais par les hosters.

Dans notre applications, les données structurée présente dans la base de données sont : Les résidents, les parties communes et les signalements.
Les fichiers uploadés sont tous simplement sauvegarder dans le fichier "media" du repository (données non structurées)
