#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>

enum class Role {
    Dealer = 1,
    NonDealer = 2
};

enum class WinEvent {
    SelfDraw = 1,
    DealerDiscard = 2,      // 庄家放炮
    NonDealerDiscard = 3    // 闲家放炮
};

enum class HandPattern {
    PingHu,
    JingDiao,
    GangKai,
    QiDui,
    ShiSanLan,
    QiXingShiSanLan
};

struct ScenarioKey {
    Role role{};
    WinEvent event{};
    bool hasJing{};
    HandPattern pattern{};

    bool operator==(const ScenarioKey &other) const noexcept {
        return role == other.role && event == other.event && hasJing == other.hasJing &&
               pattern == other.pattern;
    }
};

struct ScenarioHasher {
    std::size_t operator()(const ScenarioKey &key) const noexcept {
        std::size_t hash = static_cast<std::size_t>(key.role);
        hash = hash * 31 + static_cast<std::size_t>(key.event);
        hash = hash * 31 + (key.hasJing ? 1 : 0);
        hash = hash * 31 + static_cast<std::size_t>(key.pattern);
        return hash;
    }
};

using ScoreTable = std::unordered_map<ScenarioKey, std::string, ScenarioHasher>;

const ScoreTable SCORE_TABLE = [] {
    ScoreTable table;

    auto add = [&table](Role role, WinEvent event, bool hasJing, HandPattern pattern,
                        std::string value) {
        table[{role, event, hasJing, pattern}] = std::move(value);
    };

    // 庄家 - 自摸
    add(Role::Dealer, WinEvent::SelfDraw, true, HandPattern::PingHu, "4");
    add(Role::Dealer, WinEvent::SelfDraw, true, HandPattern::JingDiao, "8");
    add(Role::Dealer, WinEvent::SelfDraw, true, HandPattern::GangKai, "8");
    add(Role::Dealer, WinEvent::SelfDraw, true, HandPattern::QiDui, "8");
    add(Role::Dealer, WinEvent::SelfDraw, true, HandPattern::ShiSanLan, "8");
    add(Role::Dealer, WinEvent::SelfDraw, true, HandPattern::QiXingShiSanLan, "16");

    add(Role::Dealer, WinEvent::SelfDraw, false, HandPattern::PingHu, "13");
    add(Role::Dealer, WinEvent::SelfDraw, false, HandPattern::GangKai, "21");
    add(Role::Dealer, WinEvent::SelfDraw, false, HandPattern::QiDui, "21");
    add(Role::Dealer, WinEvent::SelfDraw, false, HandPattern::ShiSanLan, "21");
    add(Role::Dealer, WinEvent::SelfDraw, false, HandPattern::QiXingShiSanLan, "37");

    // 庄家 - 闲家放炮
    add(Role::Dealer, WinEvent::NonDealerDiscard, true, HandPattern::PingHu,
        "放炮4个，闲家2个");
    add(Role::Dealer, WinEvent::NonDealerDiscard, true, HandPattern::QiDui,
        "放炮8个，闲家4个");
    add(Role::Dealer, WinEvent::NonDealerDiscard, true, HandPattern::ShiSanLan,
        "放炮8个，闲家4个");
    add(Role::Dealer, WinEvent::NonDealerDiscard, true, HandPattern::QiXingShiSanLan,
        "放炮16个，闲家8个");

    add(Role::Dealer, WinEvent::NonDealerDiscard, false, HandPattern::PingHu,
        "放炮13个，闲家4个");
    add(Role::Dealer, WinEvent::NonDealerDiscard, false, HandPattern::QiDui,
        "放炮21个，闲家8个");
    add(Role::Dealer, WinEvent::NonDealerDiscard, false, HandPattern::ShiSanLan,
        "放炮21个，闲家8个");
    add(Role::Dealer, WinEvent::NonDealerDiscard, false, HandPattern::QiXingShiSanLan,
        "放炮37个，闲家16个");

    // 闲家 - 自摸
    add(Role::NonDealer, WinEvent::SelfDraw, true, HandPattern::PingHu,
        "庄家4个，闲家2个");
    add(Role::NonDealer, WinEvent::SelfDraw, true, HandPattern::JingDiao,
        "庄家8个，闲家4个");
    add(Role::NonDealer, WinEvent::SelfDraw, true, HandPattern::GangKai,
        "庄家8个，闲家4个");
    add(Role::NonDealer, WinEvent::SelfDraw, true, HandPattern::QiDui,
        "庄家8个，闲家4个");
    add(Role::NonDealer, WinEvent::SelfDraw, true, HandPattern::ShiSanLan,
        "庄家8个，闲家4个");
    add(Role::NonDealer, WinEvent::SelfDraw, true, HandPattern::QiXingShiSanLan,
        "庄家16个，闲家8个");

    add(Role::NonDealer, WinEvent::SelfDraw, false, HandPattern::PingHu,
        "庄家13个，闲家9个");
    add(Role::NonDealer, WinEvent::SelfDraw, false, HandPattern::GangKai,
        "庄家21个，闲家13个");
    add(Role::NonDealer, WinEvent::SelfDraw, false, HandPattern::QiDui,
        "庄家21个，闲家13个");
    add(Role::NonDealer, WinEvent::SelfDraw, false, HandPattern::ShiSanLan,
        "庄家21个，闲家13个");
    add(Role::NonDealer, WinEvent::SelfDraw, false, HandPattern::QiXingShiSanLan,
        "庄家37个，闲家21个");

    // 闲家 - 庄家放炮
    add(Role::NonDealer, WinEvent::DealerDiscard, true, HandPattern::PingHu,
        "庄家4个，闲家1个");
    add(Role::NonDealer, WinEvent::DealerDiscard, true, HandPattern::QiDui,
        "庄家8个，闲家2个");
    add(Role::NonDealer, WinEvent::DealerDiscard, true, HandPattern::ShiSanLan,
        "庄家8个，闲家2个");
    add(Role::NonDealer, WinEvent::DealerDiscard, true, HandPattern::QiXingShiSanLan,
        "庄家16个，闲家4个");

    add(Role::NonDealer, WinEvent::DealerDiscard, false, HandPattern::PingHu,
        "庄家13个，闲家2个");
    add(Role::NonDealer, WinEvent::DealerDiscard, false, HandPattern::QiDui,
        "庄家21个，闲家4个");
    add(Role::NonDealer, WinEvent::DealerDiscard, false, HandPattern::ShiSanLan,
        "庄家21个，闲家4个");
    add(Role::NonDealer, WinEvent::DealerDiscard, false, HandPattern::QiXingShiSanLan,
        "庄家37个，闲家8个");

    // 闲家 - 闲家放炮
    add(Role::NonDealer, WinEvent::NonDealerDiscard, true, HandPattern::PingHu,
        "庄家2个，放炮2个，闲家1个");
    add(Role::NonDealer, WinEvent::NonDealerDiscard, true, HandPattern::QiDui,
        "庄家4个，放炮4个，闲家2个");
    add(Role::NonDealer, WinEvent::NonDealerDiscard, true, HandPattern::ShiSanLan,
        "庄家4个，放炮4个，闲家2个");
    add(Role::NonDealer, WinEvent::NonDealerDiscard, true, HandPattern::QiXingShiSanLan,
        "庄家8个，放炮8个，闲家4个");

    add(Role::NonDealer, WinEvent::NonDealerDiscard, false, HandPattern::PingHu,
        "庄家4个，放炮9个，闲家2个");
    add(Role::NonDealer, WinEvent::NonDealerDiscard, false, HandPattern::QiDui,
        "庄家8个，放炮13个，闲家4个");
    add(Role::NonDealer, WinEvent::NonDealerDiscard, false, HandPattern::ShiSanLan,
        "庄家8个，放炮13个，闲家4个");
    add(Role::NonDealer, WinEvent::NonDealerDiscard, false, HandPattern::QiXingShiSanLan,
        "庄家16个，放炮21个，闲家8个");

    return table;
}();

std::string handPatternToString(HandPattern pattern) {
    switch (pattern) {
        case HandPattern::PingHu:
            return "平胡";
        case HandPattern::JingDiao:
            return "精吊";
        case HandPattern::GangKai:
            return "杠开";
        case HandPattern::QiDui:
            return "7对";
        case HandPattern::ShiSanLan:
            return "十三烂";
        case HandPattern::QiXingShiSanLan:
            return "七星十三烂";
    }
    return "";
}

void showHandPatternMenu() {
    std::cout << "请选择牌型：\n";
    const std::vector<HandPattern> patterns = {
        HandPattern::PingHu, HandPattern::JingDiao, HandPattern::GangKai,
        HandPattern::QiDui, HandPattern::ShiSanLan, HandPattern::QiXingShiSanLan};
    for (std::size_t i = 0; i < patterns.size(); ++i) {
        std::cout << "  " << (i + 1) << ". " << handPatternToString(patterns[i]) << '\n';
    }
}

Role askRole() {
    while (true) {
        std::cout << "请选择身份（1. 庄家  2. 闲家）：";
        std::string input;
        if (!(std::cin >> input)) {
            return Role::Dealer;
        }
        if (input == "1" || input == "庄家") {
            return Role::Dealer;
        }
        if (input == "2" || input == "闲家") {
            return Role::NonDealer;
        }
        std::cout << "输入无效，请重新输入。\n";
    }
}

WinEvent askWinEvent(Role role) {
    while (true) {
        if (role == Role::Dealer) {
            std::cout << "请选择胡牌方式（1. 自摸  2. 闲家放炮）：";
        } else {
            std::cout << "请选择胡牌方式（1. 自摸  2. 庄家放炮  3. 闲家放炮）：";
        }

        std::string input;
        if (!(std::cin >> input)) {
            return WinEvent::SelfDraw;
        }

        if (input == "1" || input == "自摸") {
            return WinEvent::SelfDraw;
        }
        if (role == Role::Dealer) {
            if (input == "2" || input == "闲家放炮") {
                return WinEvent::NonDealerDiscard;
            }
        } else {
            if (input == "2" || input == "庄家放炮") {
                return WinEvent::DealerDiscard;
            }
            if (input == "3" || input == "闲家放炮") {
                return WinEvent::NonDealerDiscard;
            }
        }

        std::cout << "输入无效，请重新输入。\n";
    }
}

bool askHasJing() {
    while (true) {
        std::cout << "是否有精？（有精输入1或\"有精\"，无精输入0或\"无精\"）：";
        std::string input;
        if (!(std::cin >> input)) {
            return false;
        }
        if (input == "1" || input == "有精" || input == "是") {
            return true;
        }
        if (input == "0" || input == "无精" || input == "否") {
            return false;
        }
        std::cout << "输入无效，请重新输入。\n";
    }
}

HandPattern askHandPattern() {
    const std::vector<HandPattern> patterns = {
        HandPattern::PingHu, HandPattern::JingDiao, HandPattern::GangKai,
        HandPattern::QiDui, HandPattern::ShiSanLan, HandPattern::QiXingShiSanLan};
    while (true) {
        showHandPatternMenu();
        std::cout << "请输入编号或牌型名称：";
        std::string input;
        if (!(std::cin >> input)) {
            return HandPattern::PingHu;
        }

        for (std::size_t i = 0; i < patterns.size(); ++i) {
            if (input == std::to_string(i + 1) || input == handPatternToString(patterns[i])) {
                return patterns[i];
            }
        }

        std::cout << "输入无效，请重新输入。\n";
    }
}

int main() {
    std::cout << "南昌麻将算牌器" << std::endl;

    Role role = askRole();
    WinEvent event = askWinEvent(role);
    bool hasJing = askHasJing();
    HandPattern pattern = askHandPattern();

    ScenarioKey key{role, event, hasJing, pattern};
    auto it = SCORE_TABLE.find(key);
    if (it != SCORE_TABLE.end()) {
        std::cout << "结算结果：" << it->second << std::endl;
    } else {
        std::cout << "暂未录入该组合的分值，请检查输入。" << std::endl;
    }

    return 0;
}
