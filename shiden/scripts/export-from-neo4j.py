#!/usr/bin/env python3
"""
Neo4jから教育理論データをエクスポートするスクリプト
TSK-001: Neo4jからデータエクスポート
"""

import json
import os
from neo4j import GraphDatabase

# Neo4j接続設定
URI = "bolt://localhost:7687"
USER = "neo4j"
PASSWORD = "password"

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "data")

def export_theories(driver):
    """理論データをエクスポート"""
    theories = []
    
    with driver.session() as session:
        result = session.run("""
            MATCH (t:Theory)
            RETURN t.id as id,
                   t.name as name,
                   t.name_ja as name_ja,
                   t.category as category,
                   t.description as description,
                   t.description_ja as description_ja,
                   t.theorists as theorists,
                   t.priority as priority,
                   t.key_principles as key_principles,
                   t.applications as applications,
                   t.strengths as strengths,
                   t.limitations as limitations
            ORDER BY t.id
        """)
        
        for record in result:
            theory = {
                "id": record["id"],
                "name": record["name"],
                "name_ja": record["name_ja"],
                "category": record["category"],
                "description": record["description"],
                "description_ja": record["description_ja"],
                "theorists": record["theorists"] or [],
                "priority": record["priority"] or 5,
                "key_principles": record["key_principles"] or [],
                "applications": record["applications"] or [],
                "strengths": record["strengths"] or [],
                "limitations": record["limitations"] or []
            }
            theories.append(theory)
    
    return theories

def export_relations(driver):
    """関係データをエクスポート"""
    relations = []
    
    with driver.session() as session:
        result = session.run("""
            MATCH (t1:Theory)-[r]->(t2:Theory)
            RETURN t1.id as source_id,
                   t2.id as target_id,
                   type(r) as relation_type,
                   COALESCE(r.weight, 1.0) as weight
            ORDER BY t1.id, t2.id
        """)
        
        for record in result:
            relation = {
                "source_id": record["source_id"],
                "target_id": record["target_id"],
                "relation_type": record["relation_type"].lower(),
                "weight": record["weight"]
            }
            relations.append(relation)
    
    return relations

def main():
    print("📥 Neo4jから教育理論データをエクスポート中...\n")
    
    # 出力ディレクトリ作成
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Neo4j接続
    driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
    
    try:
        # 理論データ
        print("1. 理論データを取得中...")
        theories = export_theories(driver)
        print(f"  ✅ {len(theories)}件の理論を取得\n")
        
        # 関係データ
        print("2. 関係データを取得中...")
        relations = export_relations(driver)
        print(f"  ✅ {len(relations)}件の関係を取得\n")
        
        # ファイル出力
        theories_path = os.path.join(OUTPUT_DIR, "theories.json")
        relations_path = os.path.join(OUTPUT_DIR, "relations.json")
        
        with open(theories_path, "w", encoding="utf-8") as f:
            json.dump(theories, f, ensure_ascii=False, indent=2)
        
        with open(relations_path, "w", encoding="utf-8") as f:
            json.dump(relations, f, ensure_ascii=False, indent=2)
        
        print("3. 出力完了:")
        print(f"  📄 {theories_path}")
        print(f"  📄 {relations_path}")
        print("\n✅ エクスポート完了!")
        
    finally:
        driver.close()

if __name__ == "__main__":
    main()
